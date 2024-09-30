
# IQRA Student BIlling Management System

A student billing management system built using the Flask web framework.


## Tech Stack

| Category             | Tech used                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Client | HTML (Jinja template engine), CSS, Vanilla JS |
| Server | Flask (Python web framework) |
| Database | MariaDB |
| ORM Tool | SQL Alchemy |
| Database Management Tool | phpMyAdmin |
| Server Stack | XAMPP |
| Development Server | Werkzeug |
| Development OS | Windows 11 |
| Payment Provider | Stripe |
| Mailer | Flask-Mail |


## Requirements

* Python (>=3.6)
* Poetry (Python package manager)
* XAMPP


## Run Locally

### Download and install these first if you do not have them yet.

1. [XAMPP](https://www.apachefriends.org/).
2. [Python](https://www.python.org/).
3. [Git](https://git-scm.com/download/win)

### Configure XAMPP

1. Start the Apache and MySQL servers from the XAMPP Control Panel.
2. Navigate to the MySQL Admin [phpMyAdmin](http://localhost/phpmyadmin/)
3. Create a new database
4. Name the database **sbms**

### Configure Gmail

1. Sign in to your Google account [here](https://myaccount.google.com/)
2. Go to the "Security" tab
3. Scroll down to the "How you sign in to Google" section
4. Click the "2-Step Verification"
5. If you have not turned the "2-Step Verification" on, scroll down and click the "Get Started" button below.
6. Follow the process for enabling the "2-Step Verification"
7. After enabling the "2-Step Verification", scroll down to the "App Passwords" section and click the right arrow next to it.
8. Type in the app name (without quotes) "sbms" and click *Create*
9. A dialog box will pop up with the app password. Copy the app password and paste it somewhere else first (i.e. IDE, Notepad). *Remove the spaces in between after pasting the password.*
10. Click "Done" after copying the password.

### Configure Stripe

1. Create a new Stripe account [here](https://dashboard.stripe.com/register). *Leave the country as it is.*
2. Check your email for activation instructions.
3. Login to your Stripe account and navigate [here](https://dashboard.stripe.com/test/apikeys) to view your API keys.
4. Click the "Publishable" and "Secret" keys to copy them and paste them somewhere else.

### Setup and Run

Install **Poetry** via Windows PowerShell (not via CMD)

```
  (Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

Clone the project.

```
  git clone https://github.com/nobrelli/Student-Billing-System.git sbms
```

Go to the project directory.

```
  cd sbms
```

Go to the **server** directory.

```
  cd server
```

Edit the ***config.py*** under `server/system` directory.

- Type in your email address to `MAIL_USERNAME`
- Copy the ***app password*** you have stored earlier and paste it into `MAIL_USERNAME`
- Copy the Stripe ***publishable key*** you have stored earlier and paste it into `STRIPE_PUBLIC_KEY`
- Copy the Stripe ***secret key*** you have stored earlier and paste it into `STRIPE_SECRET_KEY`

```
...
    # MAILER
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 465
    MAIL_USERNAME = ''
    MAIL_PASSWORD = ''
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True

    STRIPE_PUBLIC_KEY = ''
    STRIPE_SECRET_KEY = ''
...
```

Create and activate the virtual environment.

```
  poetry shell
```

Install the dependencies.

```
  poetry install
```

Run the Flask development server.

```
  flask run
```
or
```
  poetry run python run.py
```

Hold `Ctrl` and click the link to view the application. **NOTE:** *Port number may differ. Mine, in this case, is **5000***

### Create a new admin

1. Navigate again to [phpMyAdmin](http://localhost/phpmyadmin)
2. Click the **admin** table
3. In the **admin** table view, go to the **SQL** tab
4. Paste the code below into the SQL editor.

```
  INSERT INTO `admins` (`entry_date`, `admin_id`, `password`, `full`) VALUES
  (NOW(), '111-111-1111', '$2b$12$A2.lIOpGNqu33UqfCtId2ODf.AC23LJA7dYmEBPH.JrA3IK3NTgf6', 1);
```

5. Click **Go** at the bottom.

### Test the app

1. Go back to the web app
2. For admins, the url endpoint is `/admin/login`. For students, the url endpoint is `/student/login`.
3. Enter the admin's ID `111-111-1111` and password `54321`

## Notes

* Loading the student's billing tab requires internet connection to load the Stripe's interface.