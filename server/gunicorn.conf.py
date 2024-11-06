import multiprocessing
from os import getenv

DEFAULT_HOST = '0.0.0.0'
DEFAULT_PORT = 8000

# Production only
wsgi_app = 'wsgi:app'
bind = f"{getenv('API_HOST', DEFAULT_HOST)}:{getenv('API_PORT', DEFAULT_PORT)}"
workers = multiprocessing.cpu_count()
threads = 4
worker_class = 'gthread'
log_level = 'info'
preload_app = True