# IQRA Student Billing System

This system is designed to efficiently manage billing and payment processes for students at IQRA Development Academy, Inc., enhancing the handling of student finances.

IQRA Website: https://iqra.edu.ph/


## Tech

#### Frontend
* Typescript
* React
* Mantine (UI)
* Tanstack Table
* Tanstack Router (routing)
* Zustand (persistent store)
* React Hook Form (form handling)
* Tanstack Query (data fetching and caching)
* Nginx (production server)

#### Backend
* Flask
* SQlAlchemy
* Poetry (Dependecy management)
* Gunicorn (production server)

## Installation (Containerized)

This project requires the following: 
- [Docker](https://docs.docker.com/desktop/install/windows-install/)

If you are on Windows and chose to install Docker under WSL, run
```
wsl --install -d Debian
```

Clone the repo
```
git clone -b v2 https://github.com/nobrelli/iqra-sbms.git
```

Run **docker compose**
```
docker compose up --watch
```

## Manual Installation for Windows

1. Download the latest [Git](https://git-scm.com/downloads/win) (select 64-bit standalone installer)
2. Download [Python v3.12.3](https://www.python.org/ftp/python/3.12.3/python-3.12.3-amd64.exe)
3. Download the latest [Node](https://nodejs.org/dist/v22.11.0/node-v22.11.0-x64.msi)
4. Run Git installer. Just click *Next* all throughout.
5. Run Python installer. **CHECK "Use admin privileges when installing py.exe" and "Add python.exe to PATH"** and click "Install Now"
6. Run Node installer. Just click *Next* all throughout.
7. Open **CMD**
8. Install **pipx**
```
py -m pip install --user pipx
```
9. Add **pipx** to PATH
```
setx path "%PATH%;%APPDATA%\Python\Python312\Scripts"
```
#### IMPORTANT: RESTART CMD BEFORE PROCEEDING
11. Install **poetry**
```
pipx install poetry
```
12. Add **poetry** to PATH
```
pipx ensurepath
```
#### IMPORTANT: CLOSE CMD AND START CMD AS "ADMINISTRATOR" BEFORE PROCEEDING
14. *cd* to the folder where you want to clone the project into

Example: `cd Documents`

15. Clone the project
```
git clone https://github.com/nobrelli/iqra-sbms.git
```
16. *cd* into the project
```
cd iqra-sbms
```
17. Install **Yarn**
```
corepack enable
yarn set version stable
```
18. If it prompts, type and enter **y** to install Yarn
19. Install the root dependencies
```
yarn
```
20. *cd* into **client** and install the client dependencies
```
cd client
yarn
```
21. *cd* into **server**
```
cd ..
cd server
```
22. Install server dependencies
```
poetry lock
poetry install --no-root
poetry shell
```
23. *cd* back to the root
```
cd ..
```
24. Run setup script
```
py setup.local.py
```
25. Select **1) Development** and hit **Enter** all throughout
26. Enter **y** to confirm
27. Enter **n** to refuse running the server
28. Run the frontend and backend servers
```
yarn run:all
```
29. If the firewall prompt pops up, just allow it.
30. Run http://localhost:5173
