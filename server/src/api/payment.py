from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from flask_pydantic import validate
from sqlalchemy import select

from ..app import db
from ..models import Bill, Payment, Receipt
from ..schemas.base import MetaModel as meta
from ..schemas.base import ResponseModel
from ..schemas.payment import (
    DeletePayment,
    MakePayment,
    BasePayment,
    Receipt as BaseReceipt,
)

payment = Blueprint("payment", __name__)


@payment.post("/make")
@jwt_required()
@validate()
def make_payment(body: MakePayment) -> Response:
    bill = db.session.scalar(select(Bill).filter_by(id=body.bill_id))

    if bill is None:
        return ResponseModel(meta=meta(message="Bill not found.")), 404

    if bill.status == "complete":
        return ResponseModel(meta=meta(message="This bill is fully paid.")), 400

    payment = Payment(**body.__dict__)

    # Update the bill
    pay_amount = body.amount
    total_amount = bill.total_amount
    bill.total_paid += pay_amount
    balance = (
        (total_amount - bill.total_paid) if total_amount > bill.total_paid else 0.00
    )
    bill.status = "complete" if balance == 0 else "partial"

    db.session.add(payment)
    db.session.commit()
    db.session.refresh(bill)
    db.session.refresh(payment)

    if payment.id is not None:
        receipt = Receipt(
            payment_id=payment.id, total_paid=bill.total_paid, balance=balance
        )
        db.session.add(receipt)
        db.session.commit()

        return ResponseModel(
            meta=meta(message="Bill settled."),
            payload={
                "paymentId": payment.id,
                "balance": balance,
            },
        ), 201

    return ResponseModel(meta=meta(message="Cannot process the payment.")), 400


@payment.get("/")
@jwt_required()
@validate()
def get_payments() -> Response:
    payments = db.session.scalars(select(Payment))
    serialized = [BasePayment(**payment.__dict__) for payment in payments]

    return ResponseModel(payload=serialized), 200


@payment.get("/<id>")
@jwt_required()
@validate()
def get_payment(id: str) -> Response:
    payment = db.session.get(Payment, id)

    if payment is None:
        return ResponseModel(meta=meta(message="Payment not found.")), 404

    return ResponseModel(
        meta=meta(message="Payment retrieved."),
        payload=BasePayment(**payment.__dict__).model_dump(by_alias=True),
    ), 200


@payment.get("/<id>/receipt")
@jwt_required()
@validate()
def get_receipt(id: str) -> Response:
    payment = db.session.get(Payment, id)

    if payment is None:
        return ResponseModel(meta=meta(message="Payment not found.")), 404

    return ResponseModel(
        payload=BaseReceipt(
            **payment.receipt.__dict__, payment=BasePayment(**payment.__dict__)
        ).model_dump(by_alias=True),
    ), 200


@payment.delete("/delete")
@jwt_required()
@validate()
def delete_fee(body: DeletePayment) -> Response:
    payment = db.session.get(Payment, body.id)

    if payment is None:
        return ResponseModel(meta=meta(message="Payment not found.")), 404

    db.session.delete(payment)
    db.session.commit()

    return ResponseModel(meta=meta(message="Payment deleted.")), 200
