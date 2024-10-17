import multiprocessing

wsgi_app = 'wsgi:app'
workers = multiprocessing.cpu_count()
threads = 2
worker_class = 'gthread'
bind = '0.0.0.0:8000'
log_level = 'info'
reload = True
preload_app = True