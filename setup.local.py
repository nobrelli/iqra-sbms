import subprocess
import shutil
import dotenv
import re
from urllib.parse import urlparse

CLIENT_DIR = "./client"
SERVER_DIR = "./server"

env = {
    "mode": None,
    "api_host": "http://localhost",
    "api_endpoint": "/api/v2",
    "api_port": 5000,
    "db_host": "",
    "db_port": 8080,
    "db_user": "root",
    "db_pass": "",
    "db_name": "dev-db",
    "admin_id": "111-111-1111",
    "admin_pass": "12345",
    "jwt_secret_key": "12345",
    "jwt_access_cookie_name": "iqra-auth",
    "jwt_csrf_cookie_name": "iqra-csrf",
    "jwt_cookie_domain": "localhost",
    "jwt_access_token_expires": 30,
    "students_system_base_url": "https://enrollment-system.vercel.app/api/",
    "students_system_api_key": "1234",
}

localhost = "(localhost|127.0.0.1)"


def prompt(message: str, default=None):
    value = None

    while default or default is None:
        value = input(message)

        if value or not value:
            break

    return value or default


print("Select build mode")
print("1) Development")
print("2) Production")

while env["mode"] not in {1, 2}:
    env["mode"] = int(input("Type in the number: "))
    
dev = env["mode"] == 1

while True:
    print("=========================================")
    print("Set the API server environment variables")

    if dev:
        env["api_port"] = int(prompt("API server port, press enter to skip: ", 5000))
    else:
        while re.search(localhost, env["api_host"]):
            env["api_host"] = prompt("API server host: ", env["api_host"])

            if re.search(localhost, env["api_host"]):
                print("In production, 'localhost' cannot be used.")

    env["api_endpoint"] = prompt(
        "API server endpoint, press enter to skip: ", env["api_endpoint"]
    )

    env["db_host"] = prompt("Database host, press enter to skip: ", env["db_host"])
    env["db_port"] = int(prompt("Database port, press enter to skip: ", env["db_port"]))
    env["db_user"] = prompt("Database user, press enter to skip: ", env["db_user"])
    env["db_pass"] = prompt("Database password, press enter to skip: ", env["db_pass"])
    env["db_name"] = prompt("Database name, press enter to skip: ", env["db_name"])

    env["admin_id"] = prompt("Admin ID, press enter to skip: ", env["admin_id"])
    env["admin_pass"] = prompt(
        "Admin password, press enter to skip: ", env["admin_pass"]
    )

    # Generate key
    try:
        env["jwt_secret_key"] = subprocess.check_output(
            "openssl rand -hex 32", shell=True, encoding="utf-8"
        ).strip()
    except subprocess.CalledProcessError:
        print("Cannot generate key, please install Git in your system.")

    env["jwt_secret_key"] = prompt(
        "JWT secret key, press enter to skip: ", env["jwt_secret_key"]
    )
    env["jwt_access_cookie_name"] = prompt(
        "JWT access cookie name, press enter to skip: ", env["jwt_access_cookie_name"]
    )
    env["jwt_csrf_cookie_name"] = prompt(
        "JWT CSRF cookie name, press enter to skip: ", env["jwt_csrf_cookie_name"]
    )
    env["jwt_cookie_domain"] = prompt(
        "JWT CSRF cookie domain, press enter to skip: ",
        urlparse(env["api_host"]).netloc,
    )
    env["jwt_access_token_expires"] = int(
        prompt(
            "JWT token expiry in minutes, press enter to skip: ",
            env["jwt_access_token_expires"],
        )
    )

    env["students_system_base_url"] = prompt(
        "Student System API server URL: ", env["students_system_base_url"]
    )
    env["students_system_api_key"] = prompt(
        "Student System API key: ", env["students_system_api_key"]
    )

    print("=========================================")

    if dev:
        print("Here's your development build settings")
    else:
        print("Here's your production build settings")

    for key, value in env.items():
        print(f"{key.upper()}: {value}")

    print()

    confirm = None

    while confirm not in {"y", "n"}:
        confirm = input("Confirm these values? (y/n) ")

    if confirm == "y":
        break

# Create a new env file with the new settings in the client
env_mode = "development" if dev else "production"
env_file = f"{CLIENT_DIR}/.env.{env_mode}.local"
shutil.copy(f"{CLIENT_DIR}/.env.default", env_file)

# Edit env file
api_url = None
if dev:
    api_url = f"{env["api_host"]}:{env["api_port"]}{env["api_endpoint"]}"
elif env["mode"] == 2:
    api_url = f"{env["api_host"]}{env["api_endpoint"]}"
    
dotenv.set_key(env_file, "VITE_API_URL", api_url)

# Create a new env file with the new settings in the server
env_file = f"{SERVER_DIR}/.env-dev" if dev else f"{SERVER_DIR}/.env"
shutil.copy(f"{SERVER_DIR}/.env-default", env_file)

# Edit env file
for key, value in env.items():
    if key in {"mode", "api_host", "api_endpoint"}:
        continue
    
    dotenv.set_key(env_file, key.upper(), str(value))

if dev:
    dotenv.set_key(env_file, "ENV", "dev")
    dotenv.set_key(env_file, "DEBUG", "1")
elif env["mode"] == 2:
    dotenv.set_key(env_file, "ENV", "prod")
    dotenv.set_key(env_file, "DEBUG", "0")

# Build frontend
print("Building frontend...")
mode = "dev" if dev else "prod"
subprocess.call(f"cd client && yarn build:{mode}", shell=True)

print("=========================================")

# Ask to start the server
confirm = None

while confirm not in {"y", "n"}:
    confirm = input("Run the server? (y/n) ")

if confirm == "y":
    command = "py run.py dev" if dev else "py run.py"
    subprocess.call(f"cd server && {command}", shell=True)
