import sys

from os import getenv
from dotenv import load_dotenv

from src.app import build_app as app

args = sys.argv[1:]
mode = args[0] if len(args) > 0 else None
config = None

if mode == "dev":
    load_dotenv(".env-dev")
else:
    load_dotenv(".env")

if __name__ == '__main__':
    app().run(
        host=getenv('APP_HOST'), 
        port=getenv('APP_PORT'),
        debug=(mode == "dev")
    )
