import pytest
from flask.testing import FlaskClient

pytest.payment_id = ""


def test_make_payment(client: FlaskClient) -> None:
    client.set_cookie(pytest.jwt_token_name, pytest.jwt_token)
    response = client.post(
        f"{pytest.api}/payments/make",
        json={"billId": pytest.bill_main_id, "amount": 1500, "method": "cash"},
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )
    data = response.get_json()["payload"]

    assert response.status_code == 201
    assert data["paymentId"]

    pytest.payment_id = data["paymentId"]


@pytest.mark.skip()
def test_check_bill_after_payment(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/bills/{pytest.bill_main_id}",
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )
    data = response.get_json()["payload"]
    assert response.status_code == 200
    assert float(data["total_paid"]) == 1500
    assert data["status"] == "partial"


@pytest.mark.skip()
def test_make_payment_with_wrong_id(client: FlaskClient) -> None:
    response = client.post(
        f"{pytest.api}/payments/make",
        json={"billId": "wrong-id", "amount": 1500, "method": "cash"},
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 404


@pytest.mark.skip()
def test_get_payments(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/payments/", headers={"X-CSRF-TOKEN": pytest.csrf_token}
    )

    assert response.status_code == 200


@pytest.mark.skip()
def test_get_payment(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/payments/{pytest.payment_id}",
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 200


@pytest.mark.skip()
def test_get_payment_with_invalid_id(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/payments/invalid-id", headers={"X-CSRF-TOKEN": pytest.csrf_token}
    )

    assert response.status_code == 404
