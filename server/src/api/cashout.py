from flask import Blueprint, Response
from flask_jwt_extended import jwt_required
from flask_pydantic import validate
from sqlalchemy import select, or_

from ..app import db
from ..models import Cashout
from ..schemas.base import MetaModel as meta, PaginatedQuery
from ..schemas.base import ResponseModel
from ..schemas.cashout import DeleteCashout, EditCashout, MakeCashout

cashout = Blueprint("cashout", __name__)


@cashout.post("/make")
@jwt_required()
@validate()
def make_cashout(body: MakeCashout) -> Response:
    cashout = Cashout(description=body.description, amount=body.amount)
    db.session.add(cashout)
    db.session.commit()
    db.session.refresh(cashout)

    if cashout.created is not None:
        return ResponseModel(
            meta=meta(message="Cash out successful."), payload={"id": cashout.id}
        ), 201

    return ResponseModel(meta=meta(message="Cannot process the request.")), 400


@cashout.get("/get_all")
@jwt_required()
@validate()
def get_outflows(query: PaginatedQuery) -> Response:
    from ..schemas.cashout import BaseCashout

    outflows = db.paginate(
        select(Cashout).order_by(Cashout.created.desc())
        .filter(
            or_(
                Cashout.id.contains(query.filter_query),
                Cashout.description.contains(query.filter_query)
            )
        ),
        page=query.page_index + 1,
        per_page=query.page_size,
        error_out=False,
    )
    serialized = [BaseCashout(**outflow.__dict__).model_dump() for outflow in outflows]

    return ResponseModel(
        meta=meta(pageCount=outflows.pages, rowCount=outflows.total),
        payload=serialized
    ), 200


@cashout.get("/<id>")
@jwt_required()
@validate()
def get_cashout_details(id: str) -> Response:
    cashout = db.session.get(Cashout, id)

    if cashout is None:
        return ResponseModel(meta=meta(message="Cash out details not found.")), 404

    return ResponseModel(
        meta=meta(message="Cash outflow details retrieved."), payload=cashout.as_dict()
    ), 200


@cashout.patch("/<id>/edit")
@jwt_required()
@validate()
def edit_outflow_details(body: EditCashout, id: str) -> Response:
    cashout = db.session.get(Cashout, id)

    if cashout is None:
        return ResponseModel(meta=meta(message="Cash out details not found.")), 404

    cashout.description = body.description
    cashout.amount = body.amount

    db.session.commit()

    return ResponseModel(
        meta=meta(message="Cash outflow edited."), payload={"id": id}
    ), 201


@cashout.delete("/delete")
@jwt_required()
@validate()
def delete_outflow(body: DeleteCashout) -> Response:
    cashout = db.session.get(Cashout, body.id)

    if cashout is None:
        return ResponseModel(meta=meta(message="Cash out details not found.")), 404

    db.session.delete(cashout)
    db.session.commit()

    return ResponseModel(meta=meta(message="Outflow deleted.")), 200
