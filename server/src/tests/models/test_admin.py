import os

import pytest
from sqlalchemy import select

from ...app import db
from ...helpers import hash_password
from ...models import Admin

TEST_ADMIN_ID = os.getenv("ADMIN_ID")
TEST_ADMIN_OLD_PASS = os.getenv("ADMIN_PASS")
TEST_ADMIN_NEW_PASS = "54321"


@pytest.mark.usefixtures("app_ctx")
def test_read_admin() -> None:
    admin = db.session.scalar(select(Admin).filter_by(admin_id=TEST_ADMIN_ID))
    assert admin is not None


@pytest.mark.usefixtures("app_ctx")
def test_update_admin() -> None:
    admin = db.session.scalar(select(Admin).filter_by(admin_id=TEST_ADMIN_ID))

    assert admin is not None

    admin.password = hash_password(TEST_ADMIN_NEW_PASS)
    db.session.commit()
    db.session.refresh(admin)

    pytest.credentials["password"] = TEST_ADMIN_NEW_PASS

    assert admin.password is not TEST_ADMIN_OLD_PASS
    assert admin.updated


@pytest.mark.skip()
@pytest.mark.order(-2)
@pytest.mark.usefixtures("app_ctx")
def test_delete_admin() -> None:
    admin = db.session.scalar(select(Admin).filter_by(admin_id=TEST_ADMIN_ID))

    assert admin is not None

    db.session.delete(admin)
    db.session.commit()

    admin = db.session.scalar(select(Admin).filter_by(admin_id=TEST_ADMIN_ID))

    assert admin is None
