import os
from datetime import timedelta

from src.helpers import get_full_path
from src.config import Config


class ProductionConfig(Config):
    def __init__(self, env_file: str) -> None:
        super().__init__(env_file)
        
        self.DB_CERT = os.getenv("DB_CERT")
        self.SQLALCHEMY_ENGINE_OPTIONS = {
            "pool_recycle": 3600,
            "pool_pre_ping": True,
            "connect_args": {
                "ssl": {
                    "ca": self.DB_CERT, 
                    "ssl_version": 2
                }
            }
        }

        self.JWT_COOKIE_DOMAIN = os.getenv('CLIENT_SITE')
        self.JWT_COOKIE_SECURE = True
        self.JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
        
        self.CORS_ORIGINS = os.getenv('CLIENT_SITE')


class DevelopmentConfig(Config):
    def __init__(self, env_file: str) -> None:
        super().__init__(env_file)

        self.DEBUG = True

        self.CORS_ALLOW_HEADERS = "*"
        self.CORS_ORIGINS = "*"
        
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False

        self.JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)


class TestingConfig(Config):
    def __init__(self, env_file: str) -> None:
        super().__init__(env_file)

        self.TESTING = True
        
        self.SQLALCHEMY_TRACK_MODIFICATIONS = False

        self.JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=1)
