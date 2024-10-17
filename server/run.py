import sys

from config import DevelopmentConfig, ProductionConfig
from src.app import build_app as app
from src.helpers import get_full_path

if __name__ == "__main__":
    args = sys.argv[1:]
    mode = args[0] if len(args) > 0 else None
    config = None

    if mode == 'production':
        config = ProductionConfig(get_full_path(".env"))
    else:
        config = DevelopmentConfig(get_full_path(".env-dev"))

    app(config).run(
        debug=mode != "production", 
        host=config.APP_HOST, 
        port=config.APP_PORT
    )
