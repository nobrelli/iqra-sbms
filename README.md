# IQRADA Student Billing System

This system is designed to efficiently manage billing and payment processes for students at IQRA Development Academy, Inc., enhancing the handling of student finances.

IQRADA Website: https://iqra.edu.ph/


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

## Installation

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
