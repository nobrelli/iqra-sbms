from datetime import timedelta

from src.config import Config


class ProductionConfig(Config):
    def __init__(self, env_file: str) -> None:
        super().__init__(env_file)

        self.JWT_COOKIE_SECURE = True
        self.JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)


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
