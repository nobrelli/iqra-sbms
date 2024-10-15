from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from flask_pydantic import validate
from sqlalchemy import select

from ..app import db
from ..models import Fee
from ..schemas.base import MetaModel as meta
from ..schemas.base import ResponseModel
from ..schemas.fee import EditFee, MakeFee

fee = Blueprint("fee", __name__)


@fee.post("/make")
@jwt_required()
@validate()
def make_fee(body: MakeFee) -> Response:
    fee = Fee(description=body.description, amount=body.amount)
    db.session.add(fee)
    db.session.commit()
    db.session.refresh(fee)

    if fee.created is not None:
        return ResponseModel(
            meta=meta(message="Fee added."), payload={"id": fee.id}
        ), 201

    return ResponseModel(meta=meta(message="Cannot add fee.")), 400


@fee.get("/")
@jwt_required()
@validate()
def get_fees() -> Response:
    from ..schemas.fee import BaseFee

    fees = db.session.scalars(select(Fee).order_by(Fee.created.desc()))
    serialized = [BaseFee(**fee.__dict__).model_dump() for fee in fees]

    return ResponseModel(payload=serialized), 200


@fee.get("/<id>")
@jwt_required()
@validate()
def get_fee(id: str) -> Response:
    fee = db.session.get(Fee, id)

    if fee is None:
        return ResponseModel(meta=meta(message="Fee not found.")), 404

    return ResponseModel(payload=fee.as_dict()), 200


@fee.patch("/<id>/edit")
@jwt_required()
@validate()
def edit_fee(body: EditFee, id: str) -> Response:
    fee = db.session.get(Fee, id)

    if fee is None:
        return ResponseModel(meta=meta(message="Fee not found.")), 404

    fee.description = body.description
    fee.amount = body.amount

    db.session.commit()

    return ResponseModel(meta=meta(message="Fee edited."), payload={"id": id}), 201


@fee.delete("/<id>/delete")
@jwt_required()
@validate()
def delete_fee(id: str) -> Response:
    fee = db.session.get(Fee, id)

    if fee is None:
        return ResponseModel(meta=meta(message="Fee not found.")), 404

    db.session.delete(fee)
    db.session.commit()

    return ResponseModel(meta=meta(message="Fee deleted.")), 200
