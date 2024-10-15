from datetime import date

import pytest
from flask.testing import FlaskClient

pytest.discount_id = ""


def test_make_discount(client: FlaskClient) -> None:
    client.set_cookie(pytest.jwt_token_name, pytest.jwt_token)
    
    response = client.post(
        f"{pytest.api}/discounts/make",
        json={
            "description": "Scholarship",
            "amount": 1200,
            "isPercent": False,
            "validUntil": date.today().isoformat(),
        },
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 201

    pytest.discount_id = response.get_json()["payload"]["id"]


def test_get_discounts(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/discounts/", headers={"X-CSRF-TOKEN": pytest.csrf_token}
    )

    assert response.status_code == 200


def test_get_discount(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/discounts/{pytest.discount_id}",
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 200


def test_get_discount_with_invalid_id(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/discounts/get",
        json={"id": "invalid-id-test"},
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 404


def test_edit_discount(client: FlaskClient) -> None:
    response = client.patch(
        f"{pytest.api}/discounts/{pytest.discount_id}/edit",
        json={
            "description": "Sponsorship",
            "amount": 0.5,
            "isPercent": True,
            "validUntil": date.today().isoformat(),
        },
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 201
