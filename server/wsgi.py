from config import ProductionConfig
from src.app import build_app as app
from src.helpers import get_full_path

if __name__ == "__main__":
    config = ProductionConfig(get_full_path(".env"))
    app(config).run(debug=False, host=config.APP_HOST)