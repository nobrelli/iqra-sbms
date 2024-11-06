import tempfile
import logging
from os import getenv
from os.path import join, abspath, dirname
from flask import Flask, json, Config
from flask_compress import Compress
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from sqlalchemy import URL, select


migrate = Migrate()
jwt = JWTManager()
cors = CORS()
compress = Compress()
dir = dirname(abspath(__file__))


def build_app(*args) -> Flask:  # noqa: ANN002
    app = Flask(__name__)
    app.logger.setLevel(logging.DEBUG)  # Enable logging
    app.url_map.strict_slashes = False
    app.config.from_pyfile(join(dir, "config.py"))

    # Init plugins
    jwt.init_app(app)
    cors.init_app(app)
    compress.init_app(app)

    init_db(app)
    init_endpoints(app)

    return app


def init_db(app: Flask) -> None:
    from .database import db

    env = getenv("ENV")

    app.config.update({"SQLALCHEMY_TRACK_MODIFICATIONS": False})

    def set_uri(uri: str) -> None:
        app.config.update({"SQLALCHEMY_DATABASE_URI": uri})

    if env == "prod":
        cert_content = getenv("DB_CERT")
        temp_cert_file_path = None

        if cert_content:
            with tempfile.NamedTemporaryFile(delete=False) as temp_cert_file:
                temp_cert_file.write(cert_content.encode())
                temp_cert_file_path = temp_cert_file.name

            app.config.update(
                {
                    "SQLALCHEMY_ENGINE_OPTIONS": {
                        "pool_recycle": 3600,
                        "pool_pre_ping": True,
                        "connect_args": {
                            "ssl": {"ca": temp_cert_file_path, "ssl_version": 2}
                        },
                    }
                }
            )

        url = URL.create(
            "mysql+pymysql",
            app.config.get("DB_USER"),
            app.config.get("DB_PASS"),
            app.config.get("DB_HOST"),
            app.config.get("DB_PORT"),
            app.config.get("DB_NAME"),
        )

        set_uri(url)
    elif env == "dev":
        set_uri(f"sqlite:///{app.config.get('DB_NAME')}.db")
    else:
        set_uri("sqlite:///:memory:")

    db_uri = app.config.get("SQLALCHEMY_DATABASE_URI")

    if not db_uri:
        raise ValueError("Database URI is not specified.")

    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        from .models import (  # noqa: F401
            Admin,
            Bill,
            Cashout,
            Discount,
            Payment,
            Receipt,
            TokenBlacklist,
        )

        db.create_all()
        seed_db(app.config)
        app.logger.info("Database initialized!")


def init_endpoints(app: Flask) -> None:
    from .api import api

    app.register_blueprint(api, url_prefix="/api/v2")


def seed_db(config: Config) -> None:
    from .helpers import hash_password
    from .models import Admin, Discount, Fee
    from .schemas.discount import MakeDiscount
    from .schemas.fee import MakeFee
    from .database import db

    # Create admin
    admin_id = config.get("ADMIN_ID")
    admin_pass = config.get("ADMIN_PASS")
    data_dir = join(dir, "..", config.get("DATA_DIR"))

    admin_exists = db.session.scalar(select(Admin).filter_by(admin_id=admin_id))

    if not admin_exists:
        admin = Admin(
            admin_id=admin_id,
            password=hash_password(admin_pass),
        )
        db.session.add(admin)
        db.session.commit()

    # Pre-populate data from pre-defined JSON files
    has_data = db.session.scalars(select(Discount)).all()

    if not len(has_data):
        with open(f"{data_dir}/discounts.json", "r") as discounts_file:
            discounts: list[MakeDiscount] = json.load(discounts_file)

            for discount in discounts:
                new_discount = Discount(
                    description=discount["description"],
                    amount=discount["amount"],
                    is_percent=discount["is_percent"],
                )
                db.session.add(new_discount)
                db.session.commit()

    has_data = db.session.scalars(select(Fee)).all()

    if not len(has_data):
        with open(f"{data_dir}/fees.json", "r") as fees_file:
            fees: list[MakeFee] = json.load(fees_file)

            for fee in fees:
                new_fee = Fee(description=fee["description"], amount=fee["amount"])
                db.session.add(new_fee)
                db.session.commit()
