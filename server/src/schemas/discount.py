from datetime import date

from pydantic import AliasGenerator, BaseModel, ConfigDict
from pydantic.alias_generators import to_camel, to_snake
from .base import IdDateTimeMixin


class BaseDiscount(BaseModel, IdDateTimeMixin):
    description: str
    amount: float
    is_percent: bool = None
    valid_from: date | None = None
    valid_until: date | None = None

    model_config = ConfigDict(
        alias_generator=AliasGenerator(serialization_alias=to_camel)
    )


class MakeDiscount(BaseModel):
    description: str
    amount: float
    is_percent: bool = None
    valid_from: date | None = None
    valid_until: date | None = None

    model_config = ConfigDict(
        alias_generator=AliasGenerator(
            validation_alias=to_camel, serialization_alias=to_snake
        )
    )


class GetDiscount(BaseModel):
    id: str


class EditDiscount(MakeDiscount):
    pass


class DeleteDiscount(GetDiscount):
    pass
