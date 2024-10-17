import multiprocessing

wsgi_app = 'run:app'
workers = multiprocessing.cpu_count()
threads = 2
worker_class = 'gthread'
log_level = 'info'
reload = True
preload_app = True