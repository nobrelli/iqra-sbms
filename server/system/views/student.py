import os
from flask import (
    Blueprint, 
    render_template, 
    session, 
    redirect, 
    url_for, 
    request
)
from sqlalchemy import func
from ..forms import (
    StudentLoginForm, 
    ChangePasswordForm,
)
from ..models import (
    Bill,
    Fee,
    Program, 
    Subject, 
    Semester,
    ProgramSubject,
    Student,
    Message
)
from ..config import Config
from ..app import db

student = Blueprint('student', __name__,
                    template_folder=os.path.join(Config.TEMPLATE_FOLDER, 'student/templates'))

# This prevents the browser from caching every page so that the user
# won't be able to go back again in history after logging out.
@student.after_request
def after_request(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


@student.before_request
def check_login():
    if 'student_id' not in session and not request.endpoint.endswith('login'):
        return redirect(url_for('student.login', next=request.path))
    
    if 'student_id' in session and request.endpoint.endswith('login'):
        return redirect(url_for('student.index'))


# ROUTES
@student.get('/')
def index():
    message_count = db.session.query(Message).filter_by(
        student_id=session.get('student_id'),
        read=False
    ).count()
    return render_template('student/dashboard.html', message_count=message_count)


@student.get('/inbox')
def inbox():
    messages = db.session.query(Message).filter_by(student_id=session.get('student_id')).order_by(Message.sent_date.desc()).all()
    message_count = db.session.query(Message).filter_by(
        student_id=session.get('student_id'),
        read=False
    ).count()
    return render_template('student/inbox.html', messages=messages, message_count=message_count)


@student.get('/inbox/read/<int:id>')
def read_message(id):
    message = db.session.query(Message).get(id)

    message_count = db.session.query(Message).filter_by(
        student_id=session.get('student_id'),
        read=False
    ).count()

    # Mark as read
    message.read = True
    db.session.commit()

    return render_template('student/read_message.html', message=message, message_count=message_count)


@student.get('/login')
def login():
    form = StudentLoginForm()
    return render_template('student/login.html', form=form)


@student.get('/bills')
def bills():
    bills = db.session.query(Bill).filter_by(student_id=session.get('student_id')).all()
    student = db.session.query(Student).filter_by(student_id=session.get('student_id')).one()
    program = db.session.query(Program).get(student.program)
    semester = db.session.query(Semester).get(student.semester_id)

    message_count = db.session.query(Message).filter_by(
        student_id=session.get('student_id'),
        read=False
    ).count()

    return render_template(
        'student/bills.html', 
        bills=bills, 
        student=student, 
        program=program,
        semester=semester,
        message_count=message_count
    )


@student.get('/payment_success')
def payment_success():
    pass


@student.get('/account')
def account():
    form = ChangePasswordForm()
    message_count = db.session.query(Message).filter_by(
        student_id=session.get('student_id'),
        read=False
    ).count()
    return render_template('student/account.html', form=form, message_count=message_count)