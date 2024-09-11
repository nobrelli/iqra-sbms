from datetime import datetime
import os
from sqlalchemy import func, or_
from ..views.admin import admin
from ..models import (
    Admin,
    Cashout,
    Fee,
    Scholarship, 
    Student, 
    Program, 
    Subject, 
    ProgramSubject,
    Semester,
    Bill,
    Payment,
    Message as MessageInfo
)
from flask import session, redirect, url_for, request, current_app, render_template
from flask_mail import Message
from ..forms import (
    AddDiscountForm,
    AddFeeForm,
    AdminLoginForm, 
    ChangePasswordForm, 
    AddProgramForm, 
    AddSubjectForm,
    AddSemesterForm,
    AddProgramSubjectForm,
    AddStudentForm
)
from ..app import db, mail
from ..utils import respond, generate_password
import shortuuid
import bcrypt

PASS_ENC = 'utf-8'


# @admin.before_request
# def check_session():
#     if 'admin_id' not in session:
#         return respond('Your session has expired. Log in again to continue.', False)
    
#     return None
def parse_program(id):
    program = db.session.query(Program).filter_by(id=id).first()
    return program.description


@admin.post('/login')
def proc_login():
    form = AdminLoginForm()

    if not form.validate_on_submit():
        return respond('Admin ID and password are required.', False)
    
    # Get the table row containing an admin account that matches the requested admin_id
    admin = db.session.query(Admin).filter_by(admin_id=form.admin_id.data).first()

    if not admin:
        return respond('An admin with this ID does not exist.', False)
    
    # Match the password hashes    
    if not bcrypt.checkpw(form.password.data.encode(PASS_ENC), admin.password.encode(PASS_ENC)):
        return respond('Your password is incorrect.', False)
    
    session['admin_id'] = admin.admin_id
    return respond('Login successful! Redirecting...')


@admin.post('/change_password')
def proc_change_password():
    form = ChangePasswordForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    admin = db.session.query(Admin).filter_by(
        admin_id=session.get('admin_id')
    ).first()

    if not bcrypt.checkpw(form.current_password.data.encode(PASS_ENC), admin.password.encode(PASS_ENC)):
        return respond('Wrong current password.', False)

    if bcrypt.checkpw(form.new_password.data.encode(PASS_ENC), admin.password.encode(PASS_ENC)):
        return respond('Your new password is the same as the current password. Think of a unique one.', False)
    
    # Apply changes
    admin.password = bcrypt.hashpw(form.new_password.data.encode(PASS_ENC), bcrypt.gensalt())
    db.session.commit()

    return respond('Password changed successfully.')


@admin.post('/add_program')
def add_program():
    form = AddProgramForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    program_exists = db.session.query(Program).filter(
        or_(
            Program.code.ilike(form.code.data),
            Program.description.ilike(form.description.data)
        )
    ).first()

    if program_exists:
        return respond('There are program(s) that already share the same code or description you entered.', False)
    
    new_program = Program(
        code=form.code.data,
        description=form.description.data
    )

    db.session.add(new_program)
    db.session.commit()
    
    return respond('New program added. Reloading...')


@admin.post('/edit_program')
def edit_program():
    form = AddProgramForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    to_edit_program = db.session.query(Program).filter_by(
        id=request.form.get('entry_id')
    ).first()

    to_edit_program.code = form.code.data
    to_edit_program.description = form.description.data

    db.session.commit()
    
    return respond('Program edited. Reloading...')


@admin.post('/delete_program')
def delete_program():
    program_id = request.get_json(True)['entry_id']
    to_delete_program = db.session.query(Program).get(program_id)
    
    if to_delete_program:
        db.session.execute(ProgramSubject.delete().where(ProgramSubject.c.program_id == program_id))
        
        for subject in to_delete_program.subjects:
            to_delete_program.subjects.remove(subject)

        db.session.delete(to_delete_program)
        db.session.commit()
    
        return respond('Program deleted. Reloading...')
    
    return respond('Could not delete.', False)


@admin.get('/get_program_info')
def get_program_info():
    entry_id = request.args.get('entry_id')
    entry = db.session.query(Program).filter_by(id=entry_id).first()

    return {
        'code': entry.code,
        'description': entry.description
    }


@admin.post('/add_subject')
def add_subject():
    form = AddSubjectForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    subject_exists = db.session.query(Subject).filter_by(
        code=form.code.data
    ).first()

    if subject_exists:
        return respond('This subject is already added.', False)
    
    new_subject = Subject(
        code=form.code.data,
        description=form.description.data
    )

    db.session.add(new_subject)
    db.session.commit()
    
    return respond('New subject added. Reloading...')


@admin.post('/edit_subject')
def edit_subject():
    form = AddSubjectForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    to_edit_subject = db.session.query(Subject).filter_by(
        id=request.form.get('entry_id')
    ).first()

    to_edit_subject.code = form.code.data
    to_edit_subject.description = form.description.data

    db.session.commit()
    
    return respond('Subject edited. Reloading...')


@admin.post('/delete_subject')
def delete_subject():
    subject_id = request.get_json(True)['entry_id']
    to_delete_subject = db.session.query(Subject).get(subject_id)
    
    if to_delete_subject:
        db.session.execute(ProgramSubject.delete().where(ProgramSubject.c.subject_id == subject_id))
        db.session.delete(to_delete_subject)
        db.session.commit()
    
        return respond('Subject deleted. Reloading...')
    
    return respond('Could not delete.', False)


@admin.get('/get_subject_info')
def get_subject_info():
    entry_id = request.args.get('entry_id')
    entry = db.session.query(Subject).filter_by(id=entry_id).first()

    return {
        'code': entry.code,
        'description': entry.description
    }


@admin.get('/get_programs')
def get_programs():
    programs = db.session.query(Program).all()
    choices = [(program.id, program.code, program.description) for program in programs]

    return choices


@admin.get('/get_discounts')
def get_discounts():
    discounts = db.session.query(Scholarship).all()
    choices = [discount.description for discount in discounts]

    return choices


@admin.get('/get_subjects')
def get_subjects():
    subjects = db.session.query(Subject).all()
    choices = [(subject.id, subject.code, subject.description) for subject in subjects]

    return choices


@admin.post('/add_semester')
def add_semester():
    form = AddSemesterForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    if db.session.query(Semester).where(
        Semester.year_start == form.year_start.data,
        Semester.year_end == form.year_end.data,
        Semester.semester == form.semester.data,
    ).count() == 1:
        return respond('This semester is already added.', False)

    if int(form.status.data):
        if db.session.query(Semester).where(
            Semester.status == True
        ).count() == 1:
            return respond('Cannot have more than one active semester.', False)
    
    new_semester = Semester(
        year_start=form.year_start.data,
        year_end=form.year_end.data,
        semester=form.semester.data,
        status=int(form.status.data)
    )

    db.session.add(new_semester)
    db.session.commit()
    
    return respond('New semester added. Reloading...')


@admin.post('/close_semester')
def close_semester():
    semester_id = request.get_json(True)['entry_id']
    semester = db.session.query(Semester).get(semester_id)

    if semester:
        semester.status = False
        db.session.commit()

        return respond('Semester closed. Reloading...')
    
    return respond('Could not close semester.', False)


@admin.post('/delete_semester')
def delete_semester():
    semester_id = request.get_json(True)['entry_id']
    to_delete_subject = db.session.query(Semester).get(semester_id)
    
    if to_delete_subject:
        db.session.delete(to_delete_subject)
        db.session.commit()
    
        return respond('Semester deleted. Reloading...')
    
    return respond('Could not delete.', False)


@admin.post('/add_program_subject')
def add_program_subject():
    form = AddProgramSubjectForm()
    
    subject_exists = db.session.execute(
        ProgramSubject.select().where(
            ProgramSubject.c.program_id == form.program_id.data,
            ProgramSubject.c.subject_id == form.subject.data
        )
    ).rowcount
    
    if subject_exists:
        return respond('This subject is already added.', False)
    
    db.session.execute(
        ProgramSubject.insert().values({
            'program_id': form.program_id.data,
            'subject_id': form.subject.data,
            'units': form.units.data,
            'year': form.year.data,
            'prereq': form.prereq.data,
            'semester': form.semester.data
        })
    )

    db.session.commit()
    
    return respond('New subject added. Reloading...')


@admin.post('/edit_program_subject')
def edit_program_subject():
    form = AddProgramSubjectForm()
    entry = request.form.get('entry_id').split(',')

    subject_id = db.session.query(Subject).filter_by(code=entry[1]).one().id
    
    db.session.execute(
        ProgramSubject
            .update()
            .where(
                ProgramSubject.c.program_id == entry[0],
                ProgramSubject.c.subject_id == subject_id
            )
            .values({
                'program_id': form.program_id.data,
                'subject_id': form.subject.data,
                'units': form.units.data,
                'year': form.year.data,
                'prereq': form.prereq.data,
                'semester': form.semester.data
            })
    )

    db.session.commit()
    
    return respond('Subject edited. Reloading...')


@admin.post('/delete_program_subject')
def delete_program_subject():
    entry = request.get_json(True)['entry_id'].split(',')

    subject_id = db.session.query(Subject).filter_by(code=entry[1]).one().id
    
    db.session.execute(ProgramSubject.delete().where(
        ProgramSubject.c.program_id == entry[0],
        ProgramSubject.c.subject_id == subject_id
    ))
    db.session.commit()
    
    return respond('Subject deleted. Reloading...')


@admin.get('/get_program_subject_info')
def get_program_subject_info():
    entry_id = request.args.get('entry_id').split(',')
    entry = db.session.execute(
        ProgramSubject
            .join(Subject, ProgramSubject.c.subject_id == Subject.id)
            .select()
            .where(
                ProgramSubject.c.program_id == entry_id[0],
                Subject.code == entry_id[1]
            )
    ).fetchone()

    subject = db.session.query(Subject).filter_by(id=entry.subject_id).one()
    
    return {
        'subject': subject.id,
        'prereq': entry.prereq,
        'units': entry.units,
        'year': entry.year,
        'semester': entry.semester
    }


@admin.get('/get_current_academic_year')
def get_current_academic_year():
    acad_year = db.session.query(Semester).where(Semester.status == True).first()
    semester = ''

    match acad_year.semester:
        case 1:
            semester = '1st'
        case 2:
            semester = '2nd'
        case _:
            semester = '3rd'

    return {
        'id': acad_year.id,
        'semester': f'{acad_year.year_start}-{acad_year.year_end} ({semester} semester)'
    }


@admin.post('/add_student')
def add_student():
    form = AddStudentForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    new_password = generate_password()
    hashed_password = bcrypt.hashpw(new_password.encode(PASS_ENC), bcrypt.gensalt())
    message = Message(
        subject='Your New Student Account',
        sender=current_app.config.get('MAIL_USERNAME'),
        recipients=[form.email.data]
    )
    message.html = render_template(
        os.path.join('mail_student_account.html'),
        firstname=form.firstname.data.upper(),
        student_id=form.student_id.data,
        password=new_password
    )
    
    new_student = Student(
        entry_date=datetime.now(),
        student_id=form.student_id.data,
        lastname=form.lastname.data.upper(),
        firstname=form.firstname.data.upper(),
        middlename=form.middlename.data.upper(),
        password=hashed_password,
        type=form.type.data,
        program=form.program.data,
        year=form.year.data,
        gender=form.gender.data,
        birthdate=form.birthdate.data,
        status=form.status.data,
        address=form.address.data,
        phone=form.phone.data,
        email=form.email.data,
        semester=form.semester.data,
        scholarship=form.scholarship.data
    )

    db.session.add(new_student)
    db.session.commit()
    
    return respond('Student added. Reloading...')


@admin.post('/edit_student')
def edit_student():
    form = AddStudentForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    to_edit_student = db.session.query(Student).filter_by(
        student_id=request.form.get('entry_id')
    ).first()

    to_edit_student.lastname = form.lastname.data.upper()
    to_edit_student.firstname = form.firstname.data.upper()
    to_edit_student.middlename = form.middlename.data.upper()
    to_edit_student.type = form.type.data
    to_edit_student.program = form.program.data
    to_edit_student.year = form.year.data
    to_edit_student.gender = form.gender.data
    to_edit_student.birthdate = form.birthdate.data
    to_edit_student.status = form.status.data
    to_edit_student.address = form.address.data
    to_edit_student.phone = form.phone.data
    to_edit_student.email = form.email.data
    to_edit_student.scholarship = form.scholarship.data

    # If discount is set, apply it to all bills except the completed bills
    # if form.scholarship.data:
    #     bills = db.session.query(Bill).filter_by(student_id=request.form.get('entry_id')).all()
    #     discount = db.session.query(Scholarship).filter_by(description=form.scholarship.data).one()
    #     sum_fees = 0

    #     if bills:
    #         for bill in bills:
    #             for fee in bill.fees:
    #                 amount = fee.amount

    #                 if fee[0].lower() == 'miscellaneous fee' and discount:
    #                     if discount.is_percent:
    #                         amount = fee[1] - fee[1] * (discount / 100)
    #                     else:
    #                         amount = fee[1] - discount

    #                 sum_fees += amount

    #             if bill.status == 'pending':
    #                 bill.total_amount = sum_fees

    db.session.commit()
    
    return respond('Student edited. Reloading...')


@admin.post('/delete_student')
def delete_student():
    student_id = request.get_json(True)['entry_id']
    to_delete_student = db.session.query(Student).filter_by(student_id=student_id).one()
    db.session.delete(to_delete_student)
    db.session.commit()
    
    return respond('Student deleted. Reloading...')


@admin.get('/get_student_info')
def get_student_info():
    entry_id = request.args.get('entry_id')
    entry = db.session.query(Student).filter_by(student_id=entry_id).first()

    return {
        'student_id': entry.student_id,
        'lastname': entry.lastname,
        'firstname': entry.firstname,
        'middlename': entry.middlename,
        'type': entry.type,
        'program': entry.program,
        'year': entry.year,
        'gender': entry.gender,
        'birthdate': entry.birthdate.strftime('%Y-%m-%d'),
        'status': entry.status,
        'address': entry.address,
        'phone': entry.phone,
        'email': entry.email,
        'semester': entry.semester
    }


@admin.post('/add_discount')
def add_discount():
    form = AddDiscountForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    new_discount = Scholarship(
        is_percent=int(form.is_percent.data),
        description=form.description.data,
        amount=form.amount.data,
    )

    db.session.add(new_discount)
    db.session.commit()
    
    return respond('Discount added. Reloading...')


@admin.post('/edit_discount')
def edit_discount():
    form = AddDiscountForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    to_edit_discount = db.session.query(Scholarship).filter_by(
        id=request.form.get('entry_id')
    ).first()

    to_edit_discount.description = form.description.data
    to_edit_discount.is_percent = int(form.is_percent.data)
    to_edit_discount.amount = form.amount.data

    db.session.commit()
    
    return respond('Discount edited. Reloading...')


@admin.post('/delete_discount')
def delete_discount():
    discount_id = request.get_json(True)['entry_id']
    to_delete_discount = db.session.query(Scholarship).filter_by(id=discount_id).one()
    db.session.delete(to_delete_discount)
    db.session.commit()
    
    return respond('Discount deleted. Reloading...')


@admin.get('/get_discount_info')
def get_discount_info():
    entry_id = request.args.get('entry_id')
    entry = db.session.query(Scholarship).filter_by(id=entry_id).first()

    return {
        'description': entry.description,
        'is_percent': int(entry.is_percent),
        'amount': entry.amount,
    }


@admin.post('/add_fee')
def add_fee():
    form = AddFeeForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    new_fee = Fee(
        description=form.description.data,
        amount=form.amount.data,
    )

    db.session.add(new_fee)
    db.session.commit()
    
    return respond('Fee added. Reloading...')


@admin.post('/edit_fee')
def edit_fee():
    form = AddFeeForm()

    if not form.validate_on_submit():
        return respond(form.errors, False)
    
    to_edit_fee = db.session.query(Fee).filter_by(
        id=request.form.get('entry_id')
    ).first()

    to_edit_fee.description = form.description.data
    to_edit_fee.amount = form.amount.data

    db.session.commit()
    
    return respond('Fee edited. Reloading...')


@admin.post('/delete_fee')
def delete_fee():
    fee_id = request.get_json(True)['entry_id']
    to_delete_fee = db.session.query(Fee).filter_by(id=fee_id).one()
    db.session.delete(to_delete_fee)
    db.session.commit()
    
    return respond('Fee deleted. Reloading...')


@admin.get('/get_fee_info')
def get_fee_info():
    entry_id = request.args.get('entry_id')
    entry = db.session.query(Fee).filter_by(id=entry_id).first()

    return {
        'description': entry.description,
        'amount': entry.amount,
    }


@admin.get('/search_student')
def search_student():
    query = '%' + request.args.get('q') + '%'
    results = db.session.query(Student).filter(
        or_(
            Student.firstname.ilike(query),
            Student.lastname.ilike(query),
            Student.middlename.ilike(query),
        )
    )

    return respond([dict(
        student_id=result.student_id,
        fullname=f'{result.lastname}, {result.firstname} {result.middlename}',
        gender=result.gender,
        program=parse_program(result.program),
        year=result.year,
        status=result.status
    ) for result in results])


@admin.post('/add_bill')
def add_bill():
    student_id = request.get_json(True)['student_id']
    fees = db.session.query(Fee).all()

    # Check if student has scholarship
    student = db.session.query(Student).filter_by(student_id=student_id).one_or_none()
    scholarship = None
    discount = None

    if student:
        scholarship = student.scholarship
        
    if scholarship != 'None':
        # Check if the scholarship is in the list
        discount = db.session.query(Scholarship).filter_by(description=scholarship).one_or_none()

    if discount:
        sum_fees = 0

        for fee in fees:
            amount = fee.amount

            if fee.description.lower() == 'miscellaneous fee':
                if discount.is_percent:
                    amount = fee.amount - fee.amount * (discount.amount / 100)
                else:
                    amount = fee.amount - discount.amount

            sum_fees += amount

    new_bill = Bill(
        bill_id=shortuuid.uuid(),
        entry_date=datetime.now(),
        student_id=student_id,
        total_amount=sum_fees,
        fees=[(fee.description, fee.amount) for fee in fees],
        discounted=True if scholarship else False,
        discount=scholarship
    )

    db.session.add(new_bill)
    db.session.commit()
    
    return respond('Bill added. Reloading...')


@admin.post('/add_multiple_bill')
def add_multiple_bill():
    student_ids = request.get_json(True)['entry_ids']
    message = request.get_json(True)['message']
    fees = db.session.query(Fee).all()

    for student_id in student_ids:
        student = db.session.query(Student).filter_by(student_id=student_id).one_or_none()
        scholarship = None if not student.scholarship != 'None' else student.scholarship
        discount = None if not scholarship else db.session.query(Scholarship).filter_by(description=scholarship).one_or_none()
        sum_fees = 0
    
        for fee in fees:
            amount = fee.amount

            if fee.description.lower() == 'miscellaneous fee' and discount:
                if discount.is_percent:
                    amount = fee.amount - fee.amount * (discount.amount / 100)
                else:
                    amount = fee.amount - discount.amount
            
            sum_fees += amount

        new_bill = Bill(
            bill_id=shortuuid.uuid(),
            entry_date=datetime.now(),
            student_id=student_id,
            total_amount=sum_fees,
            fees=[(fee.description, fee.amount) for fee in fees],
            discounted=True if scholarship else False,
            discount=scholarship
        )

        if (message):
            new_message = MessageInfo(
                sent_date=datetime.now(),
                student_id=student_id,
                sender='System',
                message=message,
                read=False
            )
            db.session.add(new_message)

        db.session.add(new_bill)

    db.session.commit()

    return respond(str(len(student_ids)) + ' students billed. Reloading...')


@admin.post('/delete_bill')
def delete_bill():
    bill_id = request.get_json(True)['entry_id']
    to_delete_bill = db.session.query(Bill).filter_by(bill_id=bill_id).one()
    db.session.delete(to_delete_bill)
    db.session.commit()
    
    return respond('Bill deleted. Reloading...')


@admin.post('/logout')
def logout():
    session.pop('admin_id')
    
    return redirect(url_for('admin.login'))


@admin.post('/add_outflow')
def add_cashout():
    profit = db.session.query(func.sum(Payment.amount)).one()[0] or 0
    withdrawn = db.session.query(func.sum(Cashout.amount)).one()[0] or 0
    net_profit = profit - withdrawn
    amount = float(request.form.get('amount'))
    
    if amount > net_profit:
        return respond(f'Insufficient balance (Available Balance: {net_profit})', False)
    
    outflow = Cashout(
        timestamp=datetime.now(),
        amount=amount,
        description=request.form.get('description')
    )
    db.session.add(outflow)
    db.session.commit()

    return respond('Cash out successful!')


@admin.get('/get_bill_info')
def get_bill_info():
    bill_id = request.args.get('bill_id')
    student_id = request.args.get('student_id')
    bill_info = db.session.query(Bill).get(bill_id)

    balance = 0.0

    if bill_info.total_paid < bill_info.total_amount:
        balance = bill_info.total_amount - bill_info.total_paid

    # Check if student has scholarship
    scholarship = bill_info.discount
    discount = None
    discount_amount = 0
        
    if bill_info.discounted == 1:
        # Check if the scholarship is in the list
        discount = db.session.query(Scholarship).filter_by(description=scholarship).one_or_none()

    if discount:
        for fee in bill_info.fees:
            if fee[0].lower() == 'miscellaneous fee':
                if discount.is_percent:
                    discount_amount = fee[1] * (discount.amount / 100)
                else:
                    discount_amount = discount.amount

    text_amount = None

    if bill_info.discounted:
        '₱' + str(round(discount.amount)) if not discount.is_percent else str(round(discount.amount)) + '%'

    return {
        'entry_date': bill_info.entry_date,
        'total_amount': bill_info.total_amount,
        'total_paid': bill_info.total_paid,
        'fees': bill_info.fees,
        'payments': bill_info.payments,
        'last_payment_date': bill_info.last_payment_date,
        'bill_id': bill_info.bill_id,
        'status': bill_info.status,
        'balance': balance,
        'discount': {
            'description': f'{scholarship} (less {text_amount})',
            'amount': discount_amount
        } if bill_info.discounted else None
    }
    

@admin.post('/acknowledge_payment')
def acknowledge_payment():
    amount = float(request.form.get('amount'))
    student_id = request.args.get('student_id')
    bill_id = request.form.get('entry_id')
    bill_info = db.session.query(Bill).get(bill_id)
    student = db.session.query(Student).filter_by(student_id=student_id).one_or_none()
    scholarship = None if not student else student.scholarship
    discount = None if not scholarship else db.session.query(Scholarship).filter_by(description=scholarship).one_or_none()
    discount_amount = 0

    for fee in bill_info.fees:
        if fee[0].lower() == 'miscellaneous fee' and discount:
            if discount.is_percent:
                discount_amount = fee[1] * (discount.amount / 100)
            else:
                discount_amount = discount.amount

    try:
        # Store payment info
        payment = Payment(
            amount=amount,
            timestamp=datetime.now(),
            billing_id=bill_id,
            payment_id=''
        )
        db.session.add(payment)

        # Update billing info
        balance = 0.0
        billing = db.session.query(Bill).get(bill_id)
        current_student = db.session.query(Student).filter_by(student_id=billing.student_id).first()
        billing.total_paid += amount
        billing.last_payment_date = datetime.now()

        if billing.total_paid >= billing.total_amount:
            billing.status = 'complete'
        else:
            billing.status = 'incomplete'
            balance = billing.total_amount - billing.total_paid
            
        db.session.commit()

        text_amount = None
        
        if billing.discounted:
            '₱' + str(round(discount.amount)) if not discount.is_percent else str(round(discount.amount)) + '%'
        
        return respond(message='Payment success!', html=render_template(
            os.path.join('mail_student_receipt.html'),
            student_name=f'{current_student.lastname}, {current_student.firstname} {current_student.middlename} ',
            student_id=current_student.student_id,
            program=parse_program(current_student.program),
            address=current_student.address,
            bill_id=bill_id,
            payment_id='',
            datetime=datetime.now(),
            items=billing.fees,
            total=billing.total_amount,
            amount=billing.total_paid,
            paid=amount,
            balance=balance,
            discount={
                'description': f'{scholarship} (less {text_amount})',
                'amount': discount_amount
            } if billing.discounted else None
        )
    )
    except Exception as e:
        return respond('Server error occurred.' + str(e), False)