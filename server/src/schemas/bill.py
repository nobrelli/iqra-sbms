from datetime import date
from pydantic import AliasGenerator, BaseModel, ConfigDict
from pydantic.alias_generators import to_camel, to_snake
from .base import IdDateTimeMixin


class BaseBill(BaseModel, IdDateTimeMixin):
    student_id: str
    total_amount: float
    total_paid: float
    due_date: date
    fees: list[str]
    status: str
    discounts: list[str] | None = None
    remarks: str | None = None
    
    model_config = ConfigDict(
        alias_generator=AliasGenerator(serialization_alias=to_camel)
    )
    

class MakeBill(BaseModel):
    student_id: int
    fees: list[str] # ['Fee1,100', 'Fee2,200', ...], basically snapshots of fees
    total_amount: float
    due_date: date
    discounts: list[str] | None = None # ['Discount1,100', 'Discount2,200', ...]
    remarks: str | None = None

    model_config = ConfigDict(
        alias_generator=AliasGenerator(
            validation_alias=to_camel, serialization_alias=to_snake
        )
    )
    
    
class MakeBills(BaseModel):
    bills: list[MakeBill]


class GetBill(BaseModel):
    id: str


class EditBill(MakeBill):
    pass


class DeleteBill(GetBill):
    pass
