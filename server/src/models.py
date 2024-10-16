from datetime import date, datetime, timezone
from typing import Any, Mapping, Optional

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import Date, DateTime, String, JSON

from .app import db
from .id import ID

class BaseSharedMixin:
    id: Mapped[str] = mapped_column(
        String(20), primary_key=True, default=lambda: ID.unique()
    )
    created: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


class UpdatedMixin(BaseSharedMixin):
    updated: Mapped[Optional[DateTime]] = mapped_column(
        DateTime, onupdate=lambda: datetime.now(timezone.utc)
    )


class Admin(db.Model, UpdatedMixin):
    __tablename__ = "admins"

    admin_id: Mapped[str] = mapped_column(String(12), unique=True)
    password: Mapped[str] = mapped_column(String(255))


class Fee(db.Model, UpdatedMixin):
    __tablename__ = "fees"

    description: Mapped[str] = mapped_column(String(200), index=True)
    amount: Mapped[float]


class Discount(db.Model, UpdatedMixin):
    __tablename__ = "discounts"

    description: Mapped[str] = mapped_column(String(200), index=True)
    amount: Mapped[float]
    is_percent: Mapped[bool]
    valid_from: Mapped[Optional[date]] = mapped_column(
        Date, default=lambda: datetime.now(timezone.utc)
    )
    valid_until: Mapped[Optional[date]] = mapped_column(Date)


class Bill(db.Model, UpdatedMixin):
    __tablename__ = "bills"

    student_id: Mapped[str] = mapped_column(String(20), index=True)
    total_amount: Mapped[float]
    total_paid: Mapped[float] = mapped_column(default=0.00)
    due_date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(20), default="unpaid")
    fees: Mapped[Mapping] = mapped_column(JSON)
    discounts: Mapped[Optional[Mapping]] = mapped_column(JSON)
    remarks: Mapped[Optional[str]] = mapped_column(String(300))

    payments: Mapped[list["Payment"]] = relationship(
        back_populates="bill", 
        cascade="all, delete-orphan", 
        order_by='Payment.created.desc()'
    )


class Payment(db.Model, BaseSharedMixin):
    __tablename__ = "payments"

    bill_id = mapped_column(ForeignKey("bills.id"))
    amount: Mapped[float]
    method: Mapped[str] = mapped_column(String(64), server_default="cash")
    remarks: Mapped[Optional[str]] = mapped_column(String(300))

    bill: Mapped["Bill"] = relationship(back_populates="payments")
    receipt: Mapped["Receipt"] = relationship(
        back_populates="payment", cascade="all, delete-orphan"
    )


class Cashout(db.Model, BaseSharedMixin):
    __tablename__ = "outflows"

    amount: Mapped[float]
    description: Mapped[str] = mapped_column(String(300), index=True)


class Receipt(db.Model, BaseSharedMixin):
    __tablename__ = "receipts"

    payment_id: Mapped[str] = mapped_column(ForeignKey("payments.id"))
    total_paid: Mapped[float]
    balance: Mapped[float]

    payment: Mapped["Payment"] = relationship(back_populates="receipt")


class TokenBlacklist(db.Model, BaseSharedMixin):
    __tablename__ = "token_blacklist"

    jti: Mapped[str] = mapped_column(String(36), index=True, unique=True)
