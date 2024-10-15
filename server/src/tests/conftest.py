import os
from datetime import datetime, timezone
from typing import Any, Generator

import pytest
from dotenv import load_dotenv
from flask import Flask
from flask.testing import FlaskClient, FlaskCliRunner

from config import TestingConfig

from ..app import build_app, db
from ..helpers import get_full_path
from ..models import Bill, Cashout, Discount

load_dotenv(".env-test")


TEST_STUDENT_ID = "2024100012"
TEST_FEES = [
    {"description": "Registration/Enrollment", "amount": 500},
    {"description": "Miscellaneous Fee", "amount": 1800},
    {"description": "SSP Fee", "amount": 500},
    {"description": "ID Fee", "amount": 160},
]
TEST_DISCOUNTS = [
    {"description": "Honor Student", "amount": 100, "is_percent": True},
    {"description": "Orphan", "amount": 900, "is_percent": False},
]
TEST_SUM = sum(fee["amount"] for fee in TEST_FEES)

pytest.api = "/api/v2"
pytest.bill_main_id = ""
pytest.jwt_token_name = os.getenv("JWT_ACCESS_COOKIE_NAME")
pytest.csrf_token_name = os.getenv("JWT_ACCESS_CSRF_COOKIE_NAME")
pytest.credentials = {
    "adminId": os.getenv("ADMIN_ID"),
    "password": os.getenv("ADMIN_PASS"),
}


@pytest.fixture(scope="session")
def app() -> Generator[Flask, Any, None]:
    config = TestingConfig(get_full_path(".env-test"))
    app = build_app(config, True)

    # Prefill db so we have some data to test with
    with app.app_context():
        _populate_db()

    yield app


@pytest.fixture
def app_ctx(app: Flask):  # noqa: ANN201
    with app.app_context():
        yield


@pytest.fixture(scope="module")
def client(app: Flask) -> FlaskClient:
    return app.test_client()


@pytest.fixture()
def runner(app: Flask) -> FlaskCliRunner:
    return app.test_cli_runner()


def _populate_db() -> None:
    fees = [
        Cashout(description=fee["description"], amount=fee["amount"])
        for fee in TEST_FEES
    ]
    discounts = [
        Discount(
            description=discount["description"],
            amount=discount["amount"],
            is_percent=discount["is_percent"],
        )
        for discount in TEST_DISCOUNTS
    ]
    
    # Format
    format_fees = [[f'{fee['description']},{fee['amount']}'] for fee in TEST_FEES]
    
    bill = Bill(
        student_id=TEST_STUDENT_ID,
        total_amount=TEST_SUM,
        fees=format_fees,
        due_date=datetime.now(timezone.utc)
    )
    db.session.add_all(fees)
    db.session.add_all(discounts)
    db.session.add(bill)
    db.session.commit()

    pytest.bill_main_id = bill.id
