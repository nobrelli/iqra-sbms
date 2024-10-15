import pytest
from sqlalchemy import select

from ...app import db
from ...models import Fee

TEST_FEE_DESC = "Registration Fee"
TEST_FEE_AMT = 500.00
TEST_FEE_NEW_AMT = 1000.00

pytest.fee_id = ""


@pytest.mark.usefixtures("app_ctx")
def test_create_fee() -> None:
    fee = Fee(description=TEST_FEE_DESC, amount=TEST_FEE_AMT)

    db.session.add(fee)
    db.session.commit()
    db.session.refresh(fee)

    assert fee.id is not None

    pytest.fee_id = fee.id


@pytest.mark.usefixtures("app_ctx")
def test_read_fee() -> None:
    fee = db.session.execute(
        db.select(Fee).filter_by(id=pytest.fee_id)
    ).scalar_one_or_none()

    assert fee is not None


@pytest.mark.usefixtures("app_ctx")
def test_update_fee() -> None:
    fee = db.session.execute(select(Fee).filter_by(id=pytest.fee_id)).scalar()

    assert fee is not None

    fee.amount = TEST_FEE_NEW_AMT
    db.session.commit()
    db.session.refresh(fee)

    assert fee.amount is not TEST_FEE_AMT
    assert fee.updated


@pytest.mark.usefixtures("app_ctx")
def test_delete_fee() -> None:
    fee = db.session.scalar(select(Fee).filter_by(id=pytest.fee_id))

    assert fee is not None

    db.session.delete(fee)
    db.session.commit()

    fee = db.session.scalar(select(Fee).filter_by(id=pytest.fee_id))

    assert fee is None
