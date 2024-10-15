import pytest
from flask.testing import FlaskClient

pytest.fee_id = ""


def test_make_fee(client: FlaskClient) -> None:
    client.set_cookie(pytest.jwt_token_name, pytest.jwt_token)
    response = client.post(
        f"{pytest.api}/fees/make",
        json={"description": "Registration Fee", "amount": 1500.50},
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )
    pytest.fee_id = response.get_json()["payload"]["id"]

    assert response.status_code == 201
    assert pytest.fee_id != ""


def test_make_fee_with_string_amount(client: FlaskClient) -> None:
    response = client.post(
        f"{pytest.api}/fees/make",
        json={"description": "Registration Fee", "amount": "1500.50"},
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 201
    assert response.get_json()["payload"]["id"] != ""


def test_get_fees(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/fees/", headers={"X-CSRF-TOKEN": pytest.csrf_token}
    )

    assert response.status_code == 200


def test_get_fee(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/fees/{pytest.fee_id}",
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 200


def test_get_fee_with_invalid_id(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/fees/get",
        json={"id": "invalid-id-test"},
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 404


def test_edit_fee(client: FlaskClient) -> None:
    response = client.patch(
        f"{pytest.api}/fees/{pytest.fee_id}/edit",
        json={"description": "ID Fee", "amount": 1200},
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 201


def test_edit_fee_with_invalid_id(client: FlaskClient) -> None:
    response = client.patch(
        f"{pytest.api}/fees/edit/invalid-id-test",
        json={"description": "ID Fee", "amount": 1200},
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 404
