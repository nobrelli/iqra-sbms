from pydantic import BaseModel
from .base import IdDateTimeMixin


class BaseFee(BaseModel, IdDateTimeMixin):
    description: str
    amount: float


class MakeFee(BaseModel):
    description: str
    amount: float


class GetFee(BaseModel):
    id: str


class EditFee(MakeFee):
    pass
