from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from flask_pydantic import validate
from sqlalchemy import select, or_

from ..app import db
from ..models import Bill
from ..schemas.base import MetaModel as meta, PaginatedQuery
from ..schemas.base import ResponseModel
from ..schemas.bill import (
    DeleteBill,
    EditBill,
    MakeBills,
    BaseBill,
)
from ..schemas.payment import BasePayment

bill = Blueprint("bill", __name__)


@bill.post("/make")
@jwt_required()
@validate()
def make_bill(body: MakeBills) -> Response:
    has_error = False
    bill_ids = []

    for bill_info in body.bills:
        bill = Bill(**bill_info.__dict__)
        db.session.add(bill)
        db.session.commit()
        db.session.refresh(bill)

        has_error = bill.created is None
        bill_ids.append(bill.id)

    if not has_error:
        return ResponseModel(
            meta=meta(message="Bill(s) added."), payload={"ids": bill_ids}
        ), 201

    return ResponseModel(meta=meta(message="Cannot add bill(s).")), 400


@bill.get("/")
@jwt_required()
@validate()
def get_bills(query: PaginatedQuery) -> Response:
    # TODO: Create search filter
    bills = db.paginate(
        select(Bill)
        .order_by(Bill.created.desc(), Bill.updated.desc())
        .filter(
            or_(
                Bill.id.contains(query.filter_query),
                Bill.student_id.contains(query.filter_query),
            )
        ),
        page=query.page_index + 1,
        per_page=query.page_size,
        error_out=False,
    )

    serialized = [
        BaseBill(**bill.__dict__).model_dump(by_alias=True) for bill in bills.items
    ]
    
    return ResponseModel(
        meta=meta(pageCount=bills.pages, rowCount=bills.total),
        payload=serialized,
    ), 200


@bill.get("/<id>")
@jwt_required()
@validate()
def get_bill(id: str) -> Response:
    bill = db.session.get(Bill, id)

    if bill is None:
        return ResponseModel(meta=meta(message="Bill not found.")), 404

    return ResponseModel(
        payload=BaseBill(**bill.__dict__).model_dump(by_alias=True),
    ), 200


@bill.get("/<id>/payments")
@jwt_required()
@validate()
def get_bill_payments(id: str) -> Response:
    bill = db.session.get(Bill, id)

    if bill is None:
        return ResponseModel(meta=meta(message="Bill not found.")), 404

    serialized = [
        BasePayment(**payment.__dict__).model_dump(by_alias=True)
        for payment in bill.payments
    ]

    return ResponseModel(payload=serialized), 200


@bill.patch("/<id>/edit")
@jwt_required()
@validate()
def edit_bill(body: EditBill, id: str) -> Response:
    bill = db.session.get(Bill, id)

    if bill is None:
        return ResponseModel(meta=meta(message="Bill not found.")), 404

    bill.fees = body.fees
    bill.discounts = body.discounts
    bill.remarks = body.remarks

    db.session.commit()

    return ResponseModel(meta=meta(message="Bill edited.", payload={"id": id})), 201


@bill.delete("/delete")
@jwt_required()
@validate()
def delete_bill(body: DeleteBill) -> Response:
    bill = db.session.get(Bill, body.id)

    if bill is None:
        return ResponseModel(meta=meta(message="Bill not found.")), 404

    db.session.delete(bill)
    db.session.commit()

    return ResponseModel(meta=meta(message="Bill deleted.")), 200
