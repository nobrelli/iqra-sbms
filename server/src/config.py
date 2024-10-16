import os

from dotenv import load_dotenv

from src.helpers import get_full_path
from sqlalchemy.engine.url import URL


# You must extend this
class Config(object):
    def __init__(self, env_file: str) -> None:
        load_dotenv(env_file)

        self.DEBUG = False
        self.TESTING = False

        self.APP_INSTANCE_DIR = get_full_path(os.getenv("APP_INSTANCE_DIR"))
        self.DATA_DIR = get_full_path('data')

        self.DB_HOST = os.getenv("DB_HOST")
        self.DB_PORT = os.getenv("DB_PORT")
        self.DB_USER = os.getenv("DB_USER")
        self.DB_PASS = os.getenv("DB_PASS")
        self.DB_NAME = os.getenv("DB_NAME")

        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
        self.JWT_TOKEN_LOCATION = "cookies"
        self.JWT_COOKIE_SECURE = False
        self.JWT_COOKIE_SAMESITE = "None"
        self.JWT_ACCESS_COOKIE_NAME = os.getenv("JWT_ACCESS_COOKIE_NAME")
        self.JWT_ACCESS_TOKEN_EXPIRES = False
        self.JWT_COOKIE_CSRF_PROTECT = True
        self.JWT_ACCESS_CSRF_COOKIE_NAME = os.getenv("JWT_ACCESS_CSRF_COOKIE_NAME")
        self.JWT_SESSION_COOKIE = False

        self.CORS_ORIGINS = "*"  # better change this
        self.CORS_METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
        self.CORS_ALLOW_HEADERS = "*"
        self.CORS_SUPPORTS_CREDENTIALS = True

        self.COMPRESS_ZSTD_LEVEL = 18

        self.ADMIN_ID = os.getenv("ADMIN_ID")
        self.ADMIN_PASS = os.getenv("ADMIN_PASS")

        self.STUDENTS_SYSTEM_BASE_URL = os.getenv("STUDENTS_SYSTEM_BASE_URL")
        self.STUDENTS_SYSTEM_API_KEY = os.getenv("STUDENTS_SYSTEM_API_KEY")

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        mode = os.getenv("MODE")
        
        if mode == "production":
            url = URL.create(
                'mysql+pymysql',
                self.DB_USER,
                self.DB_PASS,
                self.DB_HOST,
                self.DB_PORT,
                self.DB_NAME,
            )
            
            return url
        elif mode == "development":
            return f"sqlite:///{self.DB_NAME}.db"
        else:
            return "sqlite:///:memory:"
