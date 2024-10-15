from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from flask_pydantic import validate
from sqlalchemy import select, func

from ..app import db
from ..models import Bill, Cashout
from ..schemas.base import ResponseModel

utils = Blueprint("utils", __name__)


@utils.get("/check_balance")
@jwt_required()
@validate()
def check_balance() -> Response:
    total_income = db.session.scalar(func.sum(Bill.total_paid)) or 0
    outflows = db.session.scalar(func.sum(Cashout.amount)) or 0
    net_income = total_income - outflows

    return ResponseModel(payload=net_income), 200


@utils.get("/count_active_bills")
@jwt_required()
@validate()
def count_active_bills() -> Response:
    count = db.session.scalar(
        select(func.count()).select_from(Bill).filter(Bill.status != "complete")
    )

    return ResponseModel(payload=count), 200
