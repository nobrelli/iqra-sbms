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
    AdminLoginForm,
    CashoutForm, 
    ChangePasswordForm, 
    AddStudentForm, 
    AddProgramForm, 
    AddSubjectForm,
    AddSemesterForm,
    AddProgramSubjectForm,
    AddFeeForm,
    SettleForm
)
from ..models import (
    Bill,
    Cashout,
    Fee,
    Payment,
    Program, 
    Subject, 
    Semester,
    ProgramSubject,
    Student,
    Message
)
from ..config import Config
from ..app import db

admin = Blueprint('admin', __name__, 
                  template_folder=os.path.join(Config.TEMPLATE_FOLDER, 'admin/templates'))

# This prevents the browser from caching every page so that the user
# won't be able to go back again in history after logging out.
@admin.after_request
def after_request(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    return response


@admin.before_request
def check_login():
    if 'admin_id' not in session and not request.endpoint.endswith('login'):
        return redirect(url_for('admin.login', next=request.path))
    
    if 'admin_id' in session and request.endpoint.endswith('login'):
        return redirect(url_for('admin.index'))


# ROUTES
@admin.get('/')
def index():
    students = db.session.query(Student).count()
    profit = db.session.query(func.sum(Payment.amount)).one()[0] or 0
    withdrawn = db.session.query(func.sum(Cashout.amount)).one()[0] or 0
    net_profit = profit - withdrawn

    return render_template('admin/dashboard.html', students=students, profit=net_profit)


@admin.get('/login')
def login():
    form = AdminLoginForm()
    return render_template('admin/login.html', form=form)


@admin.get('/students')
def students():
    student_form = AddStudentForm()
    students = db.session.query(Student).order_by(
        Student.entry_date.desc(),
        Student.lastname.asc()
    ).all()
    fees = db.session.query(Fee).all()

    sum_fees = 0

    for fee in fees:
        sum_fees += fee.amount

    return render_template(
        'admin/students.html', 
        student_form=student_form, 
        students=students, 
        fees=fees, 
        sum_fees=sum_fees
    )


@admin.get('/account')
def account():
    form = ChangePasswordForm()
    return render_template('admin/account.html', form=form)


@admin.get('/catalog')
def catalog():
    program_form = AddProgramForm()
    subject_form = AddSubjectForm()
    semester_form = AddSemesterForm()

    programs = db.session.query(Program).order_by(Program.description.asc())
    subjects = db.session.query(Subject).order_by(Subject.description.asc())
    semesters = db.session.query(Semester).order_by(
        Semester.year_start.desc(), 
        Semester.year_end.desc(),
        Semester.semester.desc()
    )
    
    return render_template(
        'admin/catalog.html', 
        program_form=program_form, 
        subject_form=subject_form,
        semester_form=semester_form,
        programs=programs,
        subjects=subjects,
        semesters=semesters
    )


@admin.get('/program/<int:id>')
def get_program(id):
    program = db.session.query(Program).get(id)
    semester = db.session.query(Semester).where(Semester.status == True).first()

    program_subjects = db.session.execute(
        ProgramSubject
            .join(Subject, ProgramSubject.c.subject_id == Subject.id)
            .select()
            .add_columns(Subject.code, Subject.description)
            .where(ProgramSubject.c.program_id == id)
            .order_by(
                ProgramSubject.c.year.asc(),
                ProgramSubject.c.semester.asc()
            )
    ).fetchall()
    
    program_subject_form = AddProgramSubjectForm()
    program_subject_form.program_id.data = id

    return render_template(
        'admin/program.html', 
        program=program, 
        semester=semester, 
        program_subject_form=program_subject_form, 
        program_subjects=program_subjects
    )


@admin.get('/fees')
def fees():
    form = AddFeeForm()
    fees = db.session.query(Fee).all()
    sum_fees = 0

    for fee in fees:
        sum_fees += fee.amount

    return render_template('admin/fees.html', add_fee_form=form, fees=fees, sum_fees=sum_fees)


@admin.get('/cashout')
def cashout():
    outflows = db.session.query(Cashout).all()
    profit = db.session.query(func.sum(Payment.amount)).one()[0]
    withdrawn = db.session.query(func.sum(Cashout.amount)).one()[0]

    cashout_form = CashoutForm()

    return render_template(
        'admin/cashout.html',
        outflows=outflows,
        profit=profit,
        withdrawn=withdrawn,
        cashout_form=cashout_form
    )


@admin.get('/student/<int:student_id>')
def view_student(student_id):
    student_form = AddStudentForm()
    settle_form = SettleForm()
    student = db.session.query(Student).get(student_id)
    program = db.session.query(Program).get(student.program)
    semester = db.session.query(Semester).get(student.semester_id)

    return render_template(
        'admin/student.html', 
        student=student,
        fullname=f'{student.lastname}, {student.firstname} {student.middlename}',
        program=program, 
        semester=semester,
        student_form=student_form,
        settle_form=settle_form
    )


@admin.get('/payment_success')
def payment_success():
    pass