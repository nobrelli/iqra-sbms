import os

class Config:
    CLIENT_FOLDER = os.path.abspath('../client')
    TEMPLATE_FOLDER = CLIENT_FOLDER
    UPLOADS_FOLDER = 'uploads'

    # DATABASE
    DB_HOST = '127.0.0.1'
    DB_PORT = 5306
    DB_USER = 'root'
    DB_PASS = ''
    DB_NAME = 'sbms'

    # MAILER
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = ''
    MAIL_PASSWORD = ''
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    STRIPE_PUBLIC_KEY = ''
    STRIPE_SECRET_KEY = ''


    @property
    def CATALOGS_FOLDER(self):
        return os.path.abspath('system/catalog')

    @property
    def SECRET_KEY(self):
        return ''
    
    @property
    def SESSION_PERMANENT(self):
        return False
    
    @property
    def SESSION_TYPE(self):
        return 'filesystem'
    
    @property
    def SESSION_COOKIE_SECURE(self):
        return True
    
    @property
    def SQLALCHEMY_TRACK_MODIFICATIONS(self):
        return False

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return f'mysql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}'
