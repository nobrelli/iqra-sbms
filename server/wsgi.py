from config import Config, DevelopmentConfig, ProductionConfig
from src.app import build_app
from src.helpers import get_full_path

mode = "development"
config = None

match mode:
    case "development":
        config = DevelopmentConfig(get_full_path(".env-dev"))
    case "production":
        config = ProductionConfig(get_full_path(".env-prod"))
    case _:
        config = Config()

app = build_app(config)
