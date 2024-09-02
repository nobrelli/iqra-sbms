import os
import stripe
from flask import Flask
from .config import Config
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
from flask_migrate import Migrate
from flask_session import Session
from flask_mail import Mail


class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)
migrate = Migrate()
session = Session()
mail = Mail()


def build_app():
    config = Config()
    app = Flask(__name__, 
                static_folder=os.path.join(config.CLIENT_FOLDER, 'static'),
                template_folder=config.TEMPLATE_FOLDER)
    app.config.from_object(config)
    
    from .views.home import home
    app.register_blueprint(home)

    from .views.admin import admin
    app.register_blueprint(admin, url_prefix='/admin')
    
    from .views.student import student
    app.register_blueprint(student, url_prefix='/student')

    db.init_app(app)
    migrate.init_app(app, db)
    session.init_app(app)
    mail.init_app(app)

    # Init payment gateway
    stripe.api_key = config.STRIPE_SECRET_KEY

    with app.app_context():
        try:
            db.create_all()
        except:
            print("Please start the database and apache server first.")

    return app