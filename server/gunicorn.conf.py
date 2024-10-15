import multiprocessing

wsgi_app = 'run:app'
workers = multiprocessing.cpu_count()
threads = 2
worker_class = 'gthread'
bind = '127.0.0.1:8000'
log_level = 'info'
reload = True
preload_app = True