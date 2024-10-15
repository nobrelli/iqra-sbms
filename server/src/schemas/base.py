from datetime import datetime
from typing import Any
from pydantic import BaseModel, ConfigDict, Field, AliasGenerator
from pydantic.alias_generators import to_camel


class MetaModel(BaseModel):
    message: str | None = None

    __pydantic_extra__: dict[str, int | str] = Field(init=False)

    # Allow extra fields
    model_config = ConfigDict(
        extra="allow"
    )


class ResponseModel(BaseModel):
    payload: Any | None = None
    meta: MetaModel | None = None


class IdDateTimeMixin:
    id: str
    created: datetime
    updated: datetime | None = None


class PaginatedQuery(BaseModel):
    page_index: int
    page_size: int
    filter_query: str
    
    model_config = ConfigDict(
        alias_generator=AliasGenerator(
            validation_alias=to_camel, serialization_alias=to_camel
        )
    )