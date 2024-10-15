from flask import Blueprint, Response, current_app, json
from flask_jwt_extended import jwt_required
from flask_pydantic import validate
from sqlalchemy import func, select

from ..app import db
from ..models import Bill
from ..helpers import api_get, parse_student_info_from_api
from ..schemas.base import MetaModel as meta
from ..schemas.base import ResponseModel

student = Blueprint("student", __name__)


@student.get("/")
@jwt_required()
@validate()
def get_students() -> Response:
    try:
        response = api_get(current_app, "student")
        data = response._content.decode()
        students = [
            parse_student_info_from_api(student) for student in json.loads(data)
        ]

        return ResponseModel(
            meta=meta(
                rowCount=len(students)
            ),
            payload=students
        ), 200

    except Exception as e:
        print(e)
        return ResponseModel(meta=meta(message="Connection timeout")), 408


@student.get("/<id>")
@jwt_required()
@validate()
def get_student(id: str) -> Response:
    try:
        response = api_get(current_app, f"student/{id}")
        data = json.loads(response._content.decode())

        if "error" in data and response.status_code == 404:
            return ResponseModel(meta=meta(message="Student not found")), 404

        return ResponseModel(payload=parse_student_info_from_api(data)), 200

    except Exception:
        return ResponseModel(meta=meta(message="Connection timeout")), 408


@student.get("/<id>/check_balance")
@jwt_required()
@validate()
def check_balance(id: str) -> Response:
    balance = (
        db.session.scalar(
            select(func.sum(Bill.total_amount - Bill.total_paid)).filter(
                Bill.student_id == id
            )
        )
        or 0
    )

    return ResponseModel(payload=balance), 200
