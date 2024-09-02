from datetime import datetime
import os
from flask_mail import Message
import stripe
from ..views.student import student
from ..forms import (
    ChangePasswordForm,
    StudentLoginForm
)
from ..models import (
    Bill,
    Payment,
    Program,
    Student,
    Message as MessageInfo
)
from flask import redirect, render_template, request, session, url_for, current_app
from ..utils import respond
from ..app import db, mail
from .admin import parse_program
import bcrypt

PASS_ENC = 'utf-8'


@student.post('/login')
def proc_login():
    form = StudentLoginForm()

    if not form.validate_on_submit():
        return respond('Student ID and password are required.', False)

    student = db.session.query(Student).filter_by(student_id=form.student_id.data).first()

    if not student:
        return respond('A student with this ID does not exist.', False)
    
    # Match the password hashes    
    if not bcrypt.checkpw(form.password.data.encode(PASS_ENC), student.password.encode(PASS_ENC)):
        return respond('Your password is incorrect.', False)
    
    session['student_id'] = student.student_id
    return respond('Login successful! Redirecting...')


@student.get('/get_bill_info')
def get_bill_info():
    bill_id = request.args.get('bill_id')
    bill_info = db.session.query(Bill).get(bill_id)
    balance = 0.0

    if bill_info.total_paid < bill_info.total_amount:
        balance = bill_info.total_amount - bill_info.total_paid

    return {
        'entry_date': bill_info.entry_date,
        'total_amount': bill_info.total_amount,
        'total_paid': bill_info.total_paid,
        'fees': bill_info.fees,
        'payments': bill_info.payments,
        'last_payment_date': bill_info.last_payment_date,
        'bill_id': bill_info.bill_id,
        'status': bill_info.status,
        'balance': balance
    }


@student.get('/request_payment_key')
def get_payment_key():
    return { 'publicKey': current_app.config.get('STRIPE_PUBLIC_KEY') }


@student.get('/create_payment_intent')
def create_payment_intent():
    # Retrieve student's email
    email = db.session.query(Student).filter_by(student_id=session.get('student_id')).first().email

    try:
        intent = stripe.PaymentIntent.create(
            amount=int(request.args.get('amount')) * 100,
            currency='PHP',
            payment_method_types=['card']
        )

        return { 'clientSecret': intent.client_secret }
    except stripe.StripeError as e:
        return respond(str(e), False)
    except Exception as e:
        return respond(str(e), False)
    

@student.post('/acknowledge_payment')
def acknowledge_payment():
    current_student = db.session.query(Student).filter_by(student_id=session.get('student_id')).first()
    
    amount = float(request.get_json()['amount'])
    payment_id = request.get_json()['payment_id']
    bill_id = request.get_json()['bill_id']

    try:
        # Store payment info
        payment = Payment(
            amount=amount,
            timestamp=datetime.now(),
            billing_id=bill_id,
            payment_id=payment_id
        )
        db.session.add(payment)

        # Update billing info
        balance = 0.0
        billing = db.session.query(Bill).get(bill_id)
        billing.total_paid += amount
        billing.last_payment_date = datetime.now()

        if billing.total_paid >= billing.total_amount:
            billing.status = 'complete'
        else:
            billing.status = 'incomplete'
            balance = billing.total_amount - billing.total_paid

        message = Message(
            subject='Payment Receipt',
            sender=current_app.config.get('MAIL_USERNAME'),
            recipients=[current_student.email],
        )
        message.html = render_template(
            os.path.join('mail_student_receipt.html'),
            student_name=f'{current_student.lastname}, {current_student.firstname} {current_student.middlename} ',
            student_id=current_student.student_id,
            program=parse_program(current_student.program),
            address=current_student.address,
            bill_id=bill_id,
            payment_id=payment_id,
            datetime=datetime.now(),
            items=billing.fees,
            total=billing.total_amount,
            amount=billing.total_paid,
            balance=balance
        )
        mail.send(message)

        db.session.commit()
    except Exception as e:
        return respond('Server error occurred.', False)

    return respond('Payment successful! Please check your email inbox to view the receipt of your payment.')


@student.post('/change_password')
def proc_change_password():
    form = ChangePasswordForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    student = db.session.query(Student).filter_by(
        student_id=session.get('student_id')
    ).first()

    if not bcrypt.checkpw(form.current_password.data.encode(PASS_ENC), student.password.encode(PASS_ENC)):
        return respond('Wrong current password.', False)

    if bcrypt.checkpw(form.new_password.data.encode(PASS_ENC), student.password.encode(PASS_ENC)):
        return respond('Your new password is the same as the current password. Think of a unique one.', False)
    
    # Apply changes
    student.password = bcrypt.hashpw(form.new_password.data.encode(PASS_ENC), bcrypt.gensalt())
    db.session.commit()

    return respond('Password changed successfully.')


@student.post('/delete_message')
def delete_message():
    message_id = request.get_json(True)['entry_id']
    to_delete = db.session.query(MessageInfo).filter_by(id=message_id).one()
    db.session.delete(to_delete)
    db.session.commit()
    
    return respond('Message deleted. Reloading...')


@student.post('/delete_messages')
def delete_messages():
    message_ids = request.get_json(True)['entry_ids']

    for message_id in message_ids:
        to_delete = db.session.query(MessageInfo).filter_by(id=message_id).one()
        db.session.delete(to_delete)

    db.session.commit()
    
    return respond(str(len(message_ids)) + ' message(s) deleted. Reloading...')



@student.post('/logout')
def logout():
    session.pop('student_id')
    
    return redirect(url_for('student.login'))