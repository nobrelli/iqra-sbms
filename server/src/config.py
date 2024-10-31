from os import getenv
from datetime import timedelta
from src.helpers import get_full_path

ENV = getenv("ENV")
DEBUG = bool(getenv("APP_DEBUG"))
TESTING = bool(getenv("APP_TESTING"))

APP_HOST = getenv("APP_HOST")
APP_PORT = getenv("APP_PORT")

DIST_DIR = get_full_path(getenv("DIST_DIR"))
DATA_DIR = get_full_path(getenv("DATA_DIR"))

DB_HOST = getenv("DB_HOST")
DB_PORT = getenv("DB_PORT")
DB_USER = getenv("DB_USER")
DB_PASS = getenv("DB_PASS")
DB_NAME = getenv("DB_NAME")
DB_CERT = getenv("DB_CERT")

JWT_SECRET_KEY = getenv("JWT_SECRET_KEY", "12345")
JWT_TOKEN_LOCATION = "cookies"
JWT_COOKIE_SECURE = ENV == "prod"
JWT_COOKIE_SAMESITE = "None" if ENV == "prod" else "Strict"
JWT_COOKIE_DOMAIN = getenv("JWT_COOKIE_DOMAIN")
JWT_ACCESS_COOKIE_NAME = getenv("JWT_ACCESS_COOKIE_NAME")
JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=int(getenv("JWT_ACCESS_TOKEN_EXPIRES")))
JWT_COOKIE_CSRF_PROTECT = True
JWT_ACCESS_CSRF_COOKIE_NAME = getenv("JWT_ACCESS_CSRF_COOKIE_NAME")
JWT_SESSION_COOKIE = False

CORS_ORIGINS = getenv("CORS_ORIGINS").split(",") if getenv("CORS_ORIGINS") else "*"
CORS_METHODS = ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
CORS_ALLOW_HEADERS = "*"
CORS_SUPPORTS_CREDENTIALS = True

COMPRESS_ZSTD_LEVEL = 18

ADMIN_ID = getenv("ADMIN_ID")
ADMIN_PASS = getenv("ADMIN_PASS")

STUDENTS_SYSTEM_BASE_URL = getenv("STUDENTS_SYSTEM_BASE_URL")
STUDENTS_SYSTEM_API_KEY = getenv("STUDENTS_SYSTEM_API_KEY")
