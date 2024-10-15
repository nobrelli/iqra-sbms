from datetime import timedelta

import pytest
from flask.testing import FlaskClient
from freezegun import freeze_time

from ...helpers import get_response_cookie_value

pytest.jwt_token = ""
pytest.csrf_token = ""


def test_login(client: FlaskClient) -> None:
    response = client.post(
        f"{pytest.api}/auth/login",
        json=pytest.credentials,
    )

    assert response.status_code == 201
    
    jwt_token = get_response_cookie_value(response, pytest.jwt_token_name)
    csrf_token = get_response_cookie_value(response, pytest.csrf_token_name)

    assert jwt_token
    assert csrf_token

    pytest.jwt_token = jwt_token
    pytest.csrf_token = csrf_token


@pytest.mark.order(-2)
def test_jwt_expiry(client: FlaskClient) -> None:
    client.set_cookie(pytest.jwt_token_name, pytest.jwt_token)
    
    ping_url = f"{pytest.api}/auth/ping"
    response = client.get(ping_url)
    test_fee = {"description": "Registration Fee", "amount": 1500.50}
    
    assert response.status_code == 200
    
    with freeze_time() as frozen_time:
        # Test refresh
        frozen_time.tick(timedelta(seconds=30))
        response = client.get(ping_url)
        
        assert response.status_code == 200
        
        new_jwt_token = get_response_cookie_value(response, pytest.jwt_token_name)
        new_csrf_token = get_response_cookie_value(response, pytest.csrf_token_name)

        # Make a request like creating a fee. The old tokens should be invalid
        response = client.post(
            f"{pytest.api}/fees/make",
            json=test_fee,
            headers={"X-CSRF-TOKEN": pytest.csrf_token},
        )
        assert response.status_code == 401

        # What if I set the new tokens...
        client.set_cookie(pytest.jwt_token_name, new_jwt_token)

        response = client.post(
            f"{pytest.api}/fees/make",
            json=test_fee,
            headers={"X-CSRF-TOKEN": new_csrf_token},
        )
        assert response.status_code == 201

        # Expired!
        frozen_time.tick(timedelta(minutes=1))
        response = client.get(ping_url)
        assert response.status_code == 401


@pytest.mark.order(-1)
def test_logout(client: FlaskClient) -> None:
    test_login(client)

    client.set_cookie(pytest.jwt_token_name, pytest.jwt_token)

    response = client.delete(
        f"{pytest.api}/auth/logout",
        json=pytest.credentials,
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 200

    response = client.get(f"{pytest.api}/auth/ping")
    assert response.status_code == 401
