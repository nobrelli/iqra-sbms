# Vercel serverless function

import sys
from os.path import join, realpath, dirname
from importlib.util import spec_from_file_location, module_from_spec
# from dotenv import load_dotenv

dir = dirname(realpath(__file__))

# Set working directory to the "server"
sys.path.append(join(dir, '..', 'server'))

# load_dotenv('server/.env-dev')

spec = spec_from_file_location("src.app", join(dir, "..", "server/src/app.py"))
app_mod = module_from_spec(spec)
spec.loader.exec_module(app_mod)
app = app_mod.build_app()
# app.run()