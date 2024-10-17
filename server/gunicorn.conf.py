import multiprocessing, os
from dotenv import load_dotenv

DEFAULT_HOST = '0.0.0.0'
DEFAULT_PORT = 8000

# Production only
load_dotenv('.env')

wsgi_app = 'wsgi'
bind = f"{os.getenv('APP_HOST', DEFAULT_HOST)}:{os.getenv('APP_PORT', DEFAULT_PORT)}"
workers = multiprocessing.cpu_count()
threads = 2
worker_class = 'gthread'
log_level = 'info'
reload = True
preload_app = True
daemon = True