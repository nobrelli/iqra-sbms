from typing import List
from dataclasses import dataclass
from .app import db
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import JSON, Date, DateTime, ForeignKey, Uuid


class Admin(db.Model):
    __tablename__ = 'admins'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    entry_date: Mapped[DateTime] = mapped_column(db.DateTime)
    admin_id: Mapped[str] = mapped_column(db.String(12), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(db.String(60))
    full: Mapped[bool] = mapped_column(db.Boolean, default=False)


class Message(db.Model):
    __tablename__ = 'messages'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    sent_date: Mapped[DateTime] = mapped_column(db.DateTime)
    student_id: Mapped[int] = mapped_column(ForeignKey('students.student_id'))
    sender: Mapped[str] = mapped_column(db.String(60))
    message: Mapped[str] = mapped_column(db.String(300))
    read: Mapped[bool] = mapped_column(db.Boolean)


class Semester(db.Model):
    __tablename__ = 'semesters'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    year_start: Mapped[int] = mapped_column(db.Integer)
    year_end: Mapped[int] = mapped_column(db.Integer)
    semester: Mapped[int] = mapped_column(db.Integer)
    status: Mapped[bool] = mapped_column(db.Boolean, default=True)
    students: Mapped[List['Student']] = relationship()


ProgramSubject = db.Table(
    'programs_subjects',
    db.Column(
        'program_id', 
        db.Integer, 
        ForeignKey(
            'programs.id', 
            onupdate='cascade', 
            ondelete='cascade'
        )
    ),
    db.Column(
        'subject_id', 
        db.Integer, 
        ForeignKey(
            'subjects.id',
            onupdate='cascade', 
            ondelete='cascade'
        )
    ),
    db.Column('units', db.Integer),
    db.Column('year', db.Integer),
    db.Column('prereq', db.String(20), nullable=True),
    db.Column('semester', db.Integer)
)


class Program(db.Model):
    __tablename__ = 'programs'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    code: Mapped[str] = mapped_column(db.String(20))
    description: Mapped[str] = mapped_column(db.String(100))
    subjects: Mapped[List['Subject']] = relationship(
        secondary=ProgramSubject, 
        back_populates='programs',
        cascade='all, delete'
    )


class Subject(db.Model):
    __tablename__ = 'subjects'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    code: Mapped[str] = mapped_column(db.String(20))
    description: Mapped[str] = mapped_column(db.String(100))
    programs: Mapped[List['Program']] = relationship(
        secondary=ProgramSubject, 
        back_populates='subjects',
        cascade='all, delete'
    )


class Student(db.Model):
    __tablename__ = 'students'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    entry_date: Mapped[DateTime] = mapped_column(db.DateTime)
    student_id: Mapped[str] = mapped_column(db.String(12), unique=True, nullable=False)
    lastname: Mapped[str] = mapped_column(db.String(40))
    firstname: Mapped[str] = mapped_column(db.String(40))
    middlename: Mapped[str] = mapped_column(db.String(40))
    password: Mapped[str] = mapped_column(db.String(60)) # pre-generated
    type: Mapped[str] = mapped_column(db.String(15))
    program: Mapped[str] = mapped_column(db.String(70))
    year: Mapped[int] = mapped_column(db.Integer)
    gender: Mapped[str] = mapped_column(db.String(1))
    birthdate: Mapped[Date] = mapped_column(db.Date)
    status: Mapped[str] = mapped_column(db.String(10))
    address: Mapped[str] = mapped_column(db.String(150))
    phone: Mapped[str] = mapped_column(db.String(15))
    email: Mapped[str] = mapped_column(db.String(100), nullable=True)
    semester_id: Mapped[int] = mapped_column(ForeignKey('semesters.id'))
    bills: Mapped[List['Bill']] = relationship(cascade='all, delete-orphan')
    

class Fee(db.Model):
    __tablename__ = 'fees'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    description: Mapped[str] = mapped_column(db.String(150))
    amount: Mapped[float] = mapped_column(db.Float)


@dataclass
class Bill(db.Model):
    __tablename__ = 'billings'

    bill_id: Mapped[str] = mapped_column(db.String(22), primary_key=True)
    entry_date: Mapped[DateTime] = mapped_column(db.DateTime)
    student_id: Mapped[int] = mapped_column(ForeignKey('students.student_id'))
    total_amount: Mapped[float] = mapped_column(db.Float)
    total_paid: Mapped[float] = mapped_column(db.Float, default=0.0)
    status: Mapped[str] = mapped_column(db.String(20), default='pending')
    fees: Mapped[JSON] = mapped_column(db.JSON)
    last_payment_date: Mapped[DateTime] = mapped_column(db.DateTime, nullable=True)
    payments: Mapped[List['Payment']] = relationship(cascade='all, delete-orphan')


@dataclass
class Payment(db.Model):
    __tablename__ = 'payments'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    amount: Mapped[float] = mapped_column(db.Float)
    timestamp: Mapped[DateTime] = mapped_column(db.DateTime)
    payment_id: Mapped[str] = mapped_column(db.String(50))
    billing_id: Mapped[int] = mapped_column(ForeignKey('billings.bill_id'))


@dataclass
class Cashout(db.Model):
    __tablename__ = 'outflows'

    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    amount: Mapped[float] = mapped_column(db.Float)
    timestamp: Mapped[DateTime] = mapped_column(db.DateTime)
    description: Mapped[str] = mapped_column(db.String(300))