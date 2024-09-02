import os, secrets, string
from .config import Config


config = Config()

def respond(message: str | object, success: bool = True, data: dict = None, html: str = None) -> dict[str, str | bool]:
    return {
        'message': message,
        'data': data,
        'success': success,
        'html': html
    }

def generate_password(length=8):
    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(length))
    return password
