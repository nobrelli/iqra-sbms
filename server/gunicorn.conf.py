import multiprocessing, os
from dotenv import load_dotenv

# Production only
load_dotenv('.env')

wsgi_app = 'wsgi:app'
bind = f'{os.getenv('APP_HOST')}:{os.getenv('APP_PORT')}'
workers = multiprocessing.cpu_count()
threads = 2
worker_class = 'gthread'
log_level = 'info'
reload = True
preload_app = True