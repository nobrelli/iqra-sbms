import pytest
from flask import Flask
from sqlalchemy import select

from ...app import db
from ...models import Bill
from ..conftest import TEST_STUDENT_ID, TEST_SUM


@pytest.mark.usefixtures("app_ctx")
def test_read_bill(app: Flask) -> None:
    bill = db.session.scalar(select(Bill).filter_by(student_id=TEST_STUDENT_ID))

    assert bill.total_amount == TEST_SUM


@pytest.mark.usefixtures("app_ctx")
def test_delete_bill(app: Flask) -> None:
    bills = db.session.scalars(select(Bill).filter_by(student_id=TEST_STUDENT_ID)).all()

    for bill in bills:
        db.session.delete(bill)

    db.session.commit()

    bills = db.session.scalars(select(Bill).filter_by(student_id=TEST_STUDENT_ID)).all()

    assert bills == []
