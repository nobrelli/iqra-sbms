import pytest
from flask.testing import FlaskClient


def test_get_students(client: FlaskClient) -> None:
    client.set_cookie(pytest.jwt_token_name, pytest.jwt_token)
    response = client.get(f"{pytest.api}/students/")

    assert response.status_code == 200
    # Access data with response.json


def test_get_student(client: FlaskClient) -> None:
    client.set_cookie(pytest.jwt_token_name, pytest.jwt_token)
    response = client.get(f"{pytest.api}/students/580")

    assert response.status_code == 200
    # Access data with response.json
