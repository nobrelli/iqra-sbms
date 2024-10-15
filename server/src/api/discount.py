from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from flask_pydantic import validate
from sqlalchemy import select

from ..app import db
from ..models import Discount
from ..schemas.base import MetaModel as meta
from ..schemas.base import ResponseModel
from ..schemas.discount import EditDiscount, MakeDiscount, BaseDiscount

discount = Blueprint("discount", __name__)


@discount.post("/make")
@jwt_required()
@validate()
def make_discount(body: MakeDiscount) -> Response:
    discount = Discount(**body.__dict__)
    db.session.add(discount)
    db.session.commit()
    db.session.refresh(discount)

    if discount.created is not None:
        return ResponseModel(
            meta=meta(message="Discount added."), payload={"id": discount.id}
        ), 201

    return ResponseModel(meta=meta(message="Cannot add discount.")), 400


@discount.get("/")
@jwt_required()
@validate()
def get_discounts() -> Response:
    discounts = db.session.scalars(select(Discount).order_by(Discount.created.desc()))
    serialized = [
        BaseDiscount(**discount.__dict__).model_dump(by_alias=True)
        for discount in discounts
    ]

    return ResponseModel(payload=serialized), 200


@discount.get("/<id>")
@jwt_required()
@validate()
def get_discount(id: str) -> Response:
    discount = db.session.get(Discount, id)

    if discount is None:
        return ResponseModel(meta=meta(message="Discount not found.")), 404

    return ResponseModel(payload=discount.as_dict()), 200


@discount.patch("/<id>/edit")
@jwt_required()
@validate()
def edit_discount(body: EditDiscount, id: str) -> Response:
    discount = db.session.get(Discount, id)

    if discount is None:
        return ResponseModel(message="Discount not found."), 404

    discount.description = body.description
    discount.amount = body.amount
    discount.is_percent = body.is_percent
    discount.valid_from = body.valid_from
    discount.valid_until = body.valid_until

    db.session.commit()

    return ResponseModel(meta=meta(message="Discount edited."), payload={"id": id}), 201


@discount.delete("/<id>/delete")
@jwt_required()
@validate()
def delete_discount(id: str) -> Response:
    discount = db.session.get(Discount, id)

    if discount is None:
        return ResponseModel(meta=meta(message="Discount not found.")), 404

    db.session.delete(discount)
    db.session.commit()

    return ResponseModel(meta=meta(message="Discount deleted.")), 200
