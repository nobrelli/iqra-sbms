import sys

from config import Config, DevelopmentConfig, ProductionConfig
from src.app import build_app as app
from src.helpers import get_full_path

if __name__ == "__main__":
    args = sys.argv[1:]
    mode = args[0] if len(args) > 0 else None
    config = None

    match mode:
        case "development":
            config = DevelopmentConfig(get_full_path(".env-dev"))
        case "production":
            config = ProductionConfig(get_full_path(".env-prod"))
        case _:
            config = Config()

    app(config).run(debug=mode != "production", host="0.0.0.0", port=5001)
