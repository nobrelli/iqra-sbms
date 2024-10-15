import pathlib

import requests
from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError, VerifyMismatchError
from flask import Flask, Response
from werkzeug.http import parse_cookie


def hash_password(raw_password: str) -> str:
    hasher = PasswordHasher()
    return hasher.hash(raw_password)


def verify_password(hashed_password: str, raw_password: str) -> bool:
    hasher = PasswordHasher()

    try:
        hasher.verify(hashed_password, raw_password)
    except (VerificationError, VerifyMismatchError, InvalidHashError):
        return False

    return True


def get_full_path(filename: str) -> pathlib.Path:
    return pathlib.Path(filename).resolve()


# Parse for Javascript
def parse_student_info_from_api(data: dict) -> dict:
    return {
        "type": data.get("type_of_student", ""),
        # "course": data.get("intended_course", ""),
        "id": data.get("student_id_no", ""),
        "yearLevel": data.get("year_level", ""),
        "lastName": data.get("last_name", ""),
        "firstName": data.get("first_name"),
        "midName": data.get("middle_name"),
        "extName": data.get("extension_name"),
        "country": data.get("country"),
        "province": data.get("province"),
        "city": data.get("city"),
        "street": data.get("street"),
        "dob": data.get("dob"),
        "birthPlace": data.get("place_of_birth"),
        "age": data.get("age"),
        "gender": data.get("gender", ""),
        "civilStatus": data.get("civil_status", ""),
        "religion": data.get("religion", ""),
        "email": data.get("email", ""),
        "phone": data.get("cellphone", ""),
        "lastSchool": data.get("last_school", ""),
        "fatherLastName": data.get("father_last_name", ""),
        "fatherFirstName": data.get("father_first_name", ""),
        "fatherMidName": data.get("father_middle_name", ""),
        "fatherExtName": data.get("father_extension_name", ""),
        "fatherWork": data.get("father_occupation", ""),
        "fatherPhone": data.get("father_cellphone", ""),
        "motherMaidenName": data.get("mother_maiden_name", ""),
        "motherLastName": data.get("mother_last_name", ""),
        "motherFirstName": data.get("mother_first_name", ""),
        "motherMidName": data.get("mother_middle_name", ""),
        "motherWork": data.get("mother_occupation", ""),
        "motherPhone": data.get("mother_cellphone", ""),
        "dswdHouseNo": data.get("dswd_house_no", ""),
        "householdIncome": data.get("household_income", ""),
        "emergencyName": data.get("emergency_name1", ""),
        "emergencyRelationship": data.get("emergency_relationship1", ""),
        "emergencyContact": data.get("emergency_contact1", ""),
        "regDate": data.get("registration_date", ""),
        "enrollmentStatus": data.get("enrollment_status", ""),
        "payingStatus": data.get("paying_status", ""),
        "totalUnitsFinished": data.get("total_units_finished", ""),
        "gpa": data.get("gpa", ""),
    }


def get_response_cookie_value(response: Response, cookie_name: str) -> str:
    cookies = response.headers.getlist("Set-Cookie")

    return parse_cookie(
        next((cookie for cookie in cookies if cookie_name in cookie), None)
    )[cookie_name]


def api_get(app: Flask, endpoint: str) -> Response:
    with app.app_context():
        api_base = app.config.get("STUDENTS_SYSTEM_BASE_URL")
        headers = {"x-api-key": app.config.get("STUDENTS_SYSTEM_API_KEY")}

        return requests.get(
            f"{api_base}{endpoint}", headers=headers, allow_redirects=True
        )
