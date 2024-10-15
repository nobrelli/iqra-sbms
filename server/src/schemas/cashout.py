from pydantic import BaseModel
from .base import IdDateTimeMixin


class BaseCashout(BaseModel, IdDateTimeMixin):
    description: str
    amount: float


class MakeCashout(BaseModel):
    description: str
    amount: float


class GetCashout(BaseModel):
    id: str


class EditCashout(MakeCashout):
    pass


class DeleteCashout(GetCashout):
    pass
