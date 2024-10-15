from datetime import datetime, timedelta, timezone

from flask import Blueprint, Response, current_app, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    set_access_cookies,
)
from flask_pydantic import validate
from sqlalchemy import select

from ..app import db, jwt
from ..models import Admin
from ..schemas.base import MetaModel as meta
from ..schemas.base import ResponseModel
from .auth import auth
from .bill import bill
from .discount import discount
from .fee import fee
from .payment import payment
from .student import student
from .cashout import cashout
from .utils import utils

api = Blueprint("api", __name__)

api.register_blueprint(auth, url_prefix="/auth")
api.register_blueprint(student, url_prefix="/students")
api.register_blueprint(fee, url_prefix="/fees")
api.register_blueprint(bill, url_prefix="/bills")
api.register_blueprint(payment, url_prefix="/payments")
api.register_blueprint(discount, url_prefix="/discounts")
api.register_blueprint(cashout, url_prefix="/cashout")
api.register_blueprint(utils)

LOGOUT_ROUTE = "logout"


@jwt.user_identity_loader
def user_identity_lookup(admin_id: str) -> str:
    return admin_id


@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_payload) -> Admin | None:  # noqa: ANN001
    from ..models import Admin

    identity = jwt_payload["sub"]

    return db.session.scalars(select(Admin).filter_by(id=identity)).first()


@jwt.expired_token_loader
@validate()
def expired_token_callback(_jwt_header, jwt_payload) -> Response:  # noqa: ANN001
    return ResponseModel(
        meta=meta(
            message="The supplied token is expired. Please log in to request a new one."
        )
    ), 401


@jwt.invalid_token_loader
@validate()
def invalid_token_callback(reason) -> Response:  # noqa: ANN001
    return ResponseModel(
        meta=meta(message="The supplied token is invalid or altered.")
    ), 400


@jwt.unauthorized_loader
@validate()
def unauthorized_callback(reason) -> Response:  # noqa: ANN001
    return ResponseModel(
        meta=meta(message="Unauthorized access. Identify yourself first.")
    ), 401


@jwt.token_in_blocklist_loader
def token_in_blocklist_callback(_jwt_header, jwt_payload) -> bool:  # noqa: ANN001
    from ..models import TokenBlacklist

    jti = jwt_payload["jti"]
    token = db.session.scalar(select(TokenBlacklist).filter_by(jti=jti))

    return token is not None


@jwt.revoked_token_loader
@validate()
def revoked_token_callback(_jwt_header, jwt_payload) -> Response:  # noqa: ANN001
    return ResponseModel(
        meta=meta(
            message="The supplied token has been revoked. \
            Please log in to request a new one."
        )
    ), 401


@api.after_request
def check_tokens(response: Response) -> Response:
    if LOGOUT_ROUTE in request.path:
        return response

    try:
        prev_token = get_jwt()
        exp_timestamp = prev_token["exp"]
        now = datetime.now(timezone.utc)

        # Check if half of the expiry time has passed
        target_timestamp = datetime.timestamp(
            now
            + timedelta(
                seconds=current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES").seconds // 2
            )
        )

        if target_timestamp > exp_timestamp:
            # Create new token if expired
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)

        return response
    except (RuntimeError, KeyError):
        return response
