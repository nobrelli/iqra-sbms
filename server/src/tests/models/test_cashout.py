import pytest
from sqlalchemy import select

from ...app import db
from ...models import Cashout

TEST_AMT = 1000.00
TEST_DESC = "For charity projects..."
pytest.cashout_id = ""


@pytest.mark.usefixtures("app_ctx")
def test_create_cashout() -> None:
    cashout = Cashout(amount=TEST_AMT, description=TEST_DESC)

    db.session.add(cashout)
    db.session.commit()
    db.session.refresh(cashout)

    pytest.cashout_id = cashout.id

    assert cashout.id is not None


@pytest.mark.usefixtures("app_ctx")
def test_read_cashout() -> None:
    cashout = db.session.scalar(select(Cashout).filter_by(id=pytest.cashout_id))

    assert cashout is not None
    assert cashout.amount == TEST_AMT
    assert cashout.description == TEST_DESC


@pytest.mark.usefixtures("app_ctx")
def test_delete_cashout() -> None:
    cashout = db.session.scalar(select(Cashout).filter_by(id=pytest.cashout_id))

    assert cashout is not None

    db.session.delete(cashout)
    db.session.commit()

    cashout = db.session.scalar(select(Cashout).filter_by(id=pytest.cashout_id))

    assert cashout is None
