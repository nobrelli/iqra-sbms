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
    MAIL_USERNAME = 'walidhadjiali11@gmail.com'
    MAIL_PASSWORD = 'zysbwlbnshjyufcf'
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    STRIPE_PUBLIC_KEY = 'pk_test_51OZvf6Jg6QAmygp5ArPJI68x9sYNxas8Q0aUAU1LfJ7N34xW7TUjWoSojRzv0lx883mmGOwPQTVPWczDOYmuRl8900CdTOZHmV'
    STRIPE_SECRET_KEY = 'sk_test_51OZvf6Jg6QAmygp5NEaOxOAFVvrzkSq8mb6FTpNABhKvQBvFmjznZ5JU7OhF6ie6cPXOG3kNrsyztbqUO3bZO8Wh00PhuFQyfB'


    @property
    def CATALOGS_FOLDER(self):
        return os.path.abspath('system/catalog')

    @property
    def SECRET_KEY(self):
        return 'dvjgth34tiugnvgoi'
    
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