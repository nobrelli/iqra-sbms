import pytest
from flask.testing import FlaskClient

from ..conftest import TEST_STUDENT_ID

pytest.bill_id = ""


def test_make_bill(client: FlaskClient) -> None:
    client.set_cookie(pytest.jwt_token_name, pytest.jwt_token)
    response = client.post(
        f"{pytest.api}/bills/make",
        json={
            "bills": [{
                "studentId": TEST_STUDENT_ID,
                "dueDate": "2024-10-15",
                "totalAmount": 1650,
                "fees": [
                    "ID Fee,150",
                    "Internet Fee,1500",
                ],
            }]
        },
        headers={"X-CSRF-TOKEN": pytest.csrf_token},
    )

    assert response.status_code == 201
    
    pytest.bill_id = response.get_json()['payload']['ids'][0]


@pytest.mark.skip()
def test_get_bills(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/bills/?pageIndex=0&pageSize=10&filterQuery="
    )
    
    assert response.status_code == 200


def test_get_bill(client: FlaskClient) -> None:
    response = client.get(
        f"{pytest.api}/bills/{pytest.bill_id}",
    )
    
    assert response.status_code == 200
