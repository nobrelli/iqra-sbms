import multiprocessing
from os import getenv
from dotenv import load_dotenv

DEFAULT_HOST = '0.0.0.0'
DEFAULT_PORT = 8000

# Production only
load_dotenv('.env')

wsgi_app = 'run'
bind = f"{getenv('API_HOST', DEFAULT_HOST)}:{getenv('API_PORT', DEFAULT_PORT)}"
workers = multiprocessing.cpu_count()
threads = 4
worker_class = 'gthread'
log_level = 'info'
reload = True
preload_app = True
daemon = True