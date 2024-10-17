import multiprocessing, os
from dotenv import load_dotenv

DEFAULT_HOST = '0.0.0.0'
DEFAULT_PORT = 8000

# Production only
load_dotenv('.env')

wsgi_app = 'wsgi'
bind = f"{os.getenv('APP_HOST', DEFAULT_HOST)}:{os.getenv('APP_PORT', DEFAULT_PORT)}"
workers = os.getenv('APP_WORKERS_COUNT')
threads = os.getenv('APP_THREADS_COUNT')
worker_class = 'gthread'
log_level = 'info'
reload = True
preload_app = True
daemon = True