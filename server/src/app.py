from os import getenv
from flask import Flask, json, Config, Response, redirect, send_from_directory
from flask_compress import Compress
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import URL
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    def as_dict(self) -> dict:
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}


db = SQLAlchemy(model_class=Base, disable_autonaming=True)
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
compress = Compress()


def build_app(*args) -> Flask:  # noqa: ANN002
    app = Flask(__name__, static_url_path='/')
    app.config.from_pyfile("config.py")
    app.static_folder = app.config.get('DIST_DIR')

    # Init plugins
    jwt.init_app(app)
    cors.init_app(app)
    compress.init_app(app)

    init_db(app)
    init_api(app)

    return app


def init_db(app: Flask) -> None:
    env = getenv("ENV")

    app.config.update({"SQLALCHEMY_TRACK_MODIFICATIONS": False})

    def set_uri(uri: str) -> None:
        app.config.update({"SQLALCHEMY_DATABASE_URI": uri})

    if env == "prod":
        app.config.update(
            {
                "SQLALCHEMY_ENGINE_OPTIONS": {
                    "pool_recycle": 3600,
                    "pool_pre_ping": True,
                    "connect_args": {
                        "ssl": {"ca": app.config.get("DB_CERT"), "ssl_version": 2}
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


def init_api(app: Flask) -> None:
    from .api import api

    @app.route('/')
    def index() -> Response:
        return send_from_directory(app.static_folder, "index.html")
        # return redirect("/app", 301)

    app.register_blueprint(api, url_prefix="/api/v2")


def seed_db(config: Config) -> None:
    from sqlalchemy import select

    from .helpers import hash_password
    from .models import Admin, Discount, Fee
    from .schemas.discount import MakeDiscount
    from .schemas.fee import MakeFee

    # Create admin
    admin_id = config.get("ADMIN_ID")
    admin_pass = config.get("ADMIN_PASS")
    data_dir = config.get("DATA_DIR")

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
