import nh3
from flask import Blueprint, Response
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)
from flask_pydantic import validate
from sqlalchemy import select

from ..app import db
from ..helpers import hash_password, verify_password
from ..models import Admin
from ..schemas.auth import Login, ChangePassword
from ..schemas.base import MetaModel as meta
from ..schemas.base import ResponseModel

auth = Blueprint("auth", __name__)


@auth.post("/login")
@validate()
def login(body: Login) -> Response:
    admin_id = nh3.clean_text(body.admin_id)
    password = nh3.clean_text(body.password)

    admin = db.session.scalar(select(Admin).filter_by(admin_id=admin_id))

    if admin is None:
        return ResponseModel(meta=meta(message="Wrong credentials.")), 404

    if verify_password(admin.password, password):
        # Create JWT
        access_token = create_access_token(identity=admin.id)
        response = Response(
            ResponseModel(
                meta=meta(
                    message="Log in successful!",
                )
            ).model_dump_json(),
            201,
            {"Content-Type": "application/json"},
        )

        set_access_cookies(response, access_token)

        return response

    return ResponseModel(meta=meta(message="Wrong credentials.")), 400


@auth.route("/ping", methods=["GET", "OPTIONS"])
@jwt_required()
@validate()
def ping() -> Response:
    return ResponseModel(meta=meta(message="You are logged in!")), 200


@auth.patch("/change_password")
@jwt_required()
@validate()
def change_password(body: ChangePassword) -> None:
    identity = get_jwt_identity()
    admin = db.session.get(Admin, identity)

    if admin is None:
        return ResponseModel(meta=meta(message="Invalid admin.")), 404

    if not verify_password(admin.password, body.current_password):
        return ResponseModel(meta=meta(message="Wrong current password.")), 400

    if verify_password(admin.password, body.new_password):
        return ResponseModel(
            meta=meta(message="The old and new passwords should not be the same.")
        ), 400
        
    admin.password = hash_password(body.new_password)
    db.session.commit()
    
    return ResponseModel(
        meta=meta(message="Password changed.")
    ), 200


@auth.delete("/logout")
@jwt_required(verify_type=False)
@validate()
def logout() -> Response:
    from ..models import TokenBlacklist

    jti = get_jwt()["jti"]
    # Blacklist token
    db.session.add(TokenBlacklist(jti=jti))
    db.session.commit()

    response = Response(
        ResponseModel(meta=meta(message="Log out successful!")).model_dump_json(),
        200,
        {"Content-Type": "application/json"},
    )
    unset_jwt_cookies(response)

    return response
