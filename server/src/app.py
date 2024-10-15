from pathlib import Path

from flask import Flask, json
from flask_compress import Compress
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

from config import Config


class Base(DeclarativeBase):
    def as_dict(self) -> dict:
        return {c.name: str(getattr(self, c.name)) for c in self.__table__.columns}


db = SQLAlchemy(model_class=Base, disable_autonaming=True)
migrate = Migrate()
jwt = JWTManager()
cors = CORS()
compress = Compress()


def build_app(config: Config, test_mode: bool = False) -> Flask:
    if not test_mode:
        # Create app's data dir
        Path(config.APP_INSTANCE_DIR).mkdir(exist_ok=True)

    app = Flask(
        __name__,
        instance_path=None if test_mode else Path(config.APP_INSTANCE_DIR, "instances"),
    )
    app.config.from_object(config)

    # Init db
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
            TokenBlacklist
        )

        db.create_all()
        _populate_db(config)

    # Init plugins
    jwt.init_app(app)
    cors.init_app(app)
    compress.init_app(app)

    from .api import api

    app.register_blueprint(api, url_prefix="/api/v2")

    return app


def _populate_db(config: Config) -> None:
    from sqlalchemy import select

    from .helpers import hash_password
    from .models import Admin, Discount, Fee
    from .schemas.discount import MakeDiscount
    from .schemas.fee import MakeFee

    # Create admin
    admin_exists = db.session.scalar(select(Admin).filter_by(admin_id=config.ADMIN_ID))

    if not admin_exists:
        admin = Admin(
            admin_id=config.ADMIN_ID,
            password=hash_password(config.ADMIN_PASS),
        )
        db.session.add(admin)
        db.session.commit()
        
        
    # Pre-populate data from pre-defined JSON files
    has_data = db.session.scalars(select(Discount)).all()
    
    if not len(has_data):
        with open(f'{config.DATA_DIR}/discounts.json', 'r') as discounts_file:
            discounts: list[MakeDiscount] = json.load(discounts_file)
            
            for discount in discounts:
                new_discount = Discount(
                    description=discount['description'],
                    amount=discount['amount'],
                    is_percent=discount['is_percent']
                )
                db.session.add(new_discount)
                db.session.commit()
                
    has_data = db.session.scalars(select(Fee)).all()
    
    if not len(has_data):
        with open(f'{config.DATA_DIR}/fees.json', 'r') as fees_file:
            fees: list[MakeFee] = json.load(fees_file)
            
            for fee in fees:
                new_fee = Fee(
                    description=fee['description'],
                    amount=fee['amount']
                )
                db.session.add(new_fee)
                db.session.commit()