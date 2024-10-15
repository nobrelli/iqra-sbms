from datetime import datetime
from pydantic import AliasGenerator, BaseModel, ConfigDict
from pydantic.alias_generators import to_camel, to_snake


class Receipt(BaseModel):
    id: str
    created: datetime
    total_paid: float
    balance: float
    payment: 'BasePayment'
    
    model_config = ConfigDict(
        alias_generator=AliasGenerator(serialization_alias=to_camel)
    )


class BasePayment(BaseModel):
    id: str
    created: datetime
    amount: float
    method: str
    remarks: str | None = None
    

class MakePayment(BaseModel):
    bill_id: str
    created: datetime | None = None
    amount: float
    method: str
    remarks: str | None = None

    model_config = ConfigDict(
        alias_generator=AliasGenerator(
            validation_alias=to_camel, serialization_alias=to_snake
        )
    )


class GetPayment(BaseModel):
    id: str


class EditPayment(MakePayment):
    pass


class DeletePayment(GetPayment):
    pass
