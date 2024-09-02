from datetime import datetime
import os
from flask_wtf import FlaskForm
from wtforms import (
    StringField, 
    PasswordField, 
    SubmitField, 
    SelectField,
    IntegerField,
    HiddenField,
    DateField,
    EmailField,
    DecimalField
)
from wtforms.validators import (
    DataRequired, 
    EqualTo, 
    NumberRange,
    Optional,
    Regexp
)

year_lvl = (
    (1, 'Freshman'),
    (2, 'Sophomore'),
    (3, 'Junior'),
    (4, 'Senior'),
    (5, 'Terminal'),
)

semesters = (
    (1, '1st Semester'),
    (2, '2nd Semester'),
    (3, '3rd Semester'),
)


class AdminLoginForm(FlaskForm):
    admin_id = StringField('Admin ID', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log in')


class StudentLoginForm(FlaskForm):
    student_id = StringField('Student ID', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Log in')


class ChangePasswordForm(FlaskForm):
    current_password = PasswordField('Current password', validators=[DataRequired()])
    new_password = PasswordField('New password', validators=[DataRequired()])
    confirm_password = PasswordField('Re-type password', validators=[DataRequired(), EqualTo('new_password', 'Passwords do not match.')])
    submit = SubmitField('Change')


class AddStudentForm(FlaskForm):
    # From https://www.regextester.com/95375
    phone_regex = r'(\+?\d{2}?\s?\d{3}\s?\d{3}\s?\d{4})|([0]\d{3}\s?\d{3}\s?\d{4})'

    semester = StringField('Academic Year')
    student_id = StringField('Student ID')
    type = SelectField('Type', validators=[DataRequired()], choices=['New Student', 'Transferee', 'Returnee'])
    status = SelectField('Status', validators=[DataRequired()], choices=['Regular', 'Irregular'])
    program = SelectField('Program', choices=[('', 'Select')], validate_choice=False)
    year = SelectField('Year', validators=[DataRequired()], choices=year_lvl)
    lastname = StringField('Last name', validators=[DataRequired()])
    firstname = StringField('First name', validators=[DataRequired()])
    middlename = StringField('Middle name')
    gender = SelectField('Gender', validators=[DataRequired()], choices=(('M', 'Male'), ('F', 'Female')))
    birthdate = DateField('Birthdate', validators=[DataRequired()])
    address = StringField('Address', validators=[DataRequired()])
    phone = StringField('Phone', validators=[DataRequired(), Regexp(phone_regex, message='Invalid phone number format.')])
    email = EmailField('Email')
    submit = SubmitField('Submit')


class CashoutForm(FlaskForm):
    amount = DecimalField('Amount', validators=[DataRequired()])
    description = StringField('Description')
    submit = SubmitField('Submit')


class AddProgramForm(FlaskForm):
    code = StringField('Program code', validators=[DataRequired()])
    description = StringField('Program description', validators=[DataRequired()])
    submit = SubmitField('Submit')


class AddSubjectForm(FlaskForm):
    code = StringField('Subject code', validators=[DataRequired()])
    description = StringField('Subject description', validators=[DataRequired()])
    submit = SubmitField('Submit')


class AddSemesterForm(FlaskForm):
    year_now = datetime.now().year
    min_year = year_now - 10
    max_year = year_now + 10

    year_start = IntegerField('Year start', 
                    validators=[
                        DataRequired(),
                        NumberRange(
                            min=min_year, 
                            max=max_year
                        )
                    ],
                    default=year_now
                )
    year_end = IntegerField('Year end (readonly)', 
                    validators=[
                        DataRequired(),
                        NumberRange(
                            min=min_year + 1,
                            max=max_year + 1
                        )
                    ],
                    default=year_now + 1
                )
    semester = SelectField('Semester', validators=[DataRequired()], choices=semesters)
    status = SelectField('Status', validators=[DataRequired()], choices=(
        (1, 'Open'),
        (0, 'Closed')
    ))
    submit = SubmitField('Submit')


class AddProgramSubjectForm(FlaskForm):
    program_id = HiddenField()
    subject = SelectField('Subject', validators=[DataRequired()], choices=[('', 'Select')], validate_choice=False)
    prereq = SelectField('Prerequisite', validators=[Optional()], choices=[('', 'None')], validate_choice=False)
    units = IntegerField('Units', validators=[DataRequired(), NumberRange(min=1)])
    year = SelectField('Year level', validators=[DataRequired()], choices=year_lvl)
    semester = SelectField('Semester', validators=[DataRequired()], choices=semesters)
    submit = SubmitField('Submit')


class AddFeeForm(FlaskForm):
    description = StringField('Description', validators=[DataRequired()])
    amount = DecimalField('Amount', validators=[DataRequired()])
    submit = SubmitField('Submit')


class SettleForm(FlaskForm):
    amount = DecimalField('Amount', validators=[DataRequired(), NumberRange(50.0)])
    submit = SubmitField('Settle Bill')