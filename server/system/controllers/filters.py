from ..views.admin import admin as bp
from ..app import db
from ..models import Program
from flask import render_template_string


@bp.add_app_template_filter
def parse_program(id):
    program = db.session.query(Program).filter_by(id=id).first()
    return program.description

@bp.add_app_template_filter
def apply_currency(value):
    return '₱ {:,.2f}'.format(value)

@bp.add_app_template_filter
def eval(code, context):
    return render_template_string(code, **context)