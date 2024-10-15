from pydantic import BaseModel, Field, AliasGenerator, ConfigDict
from pydantic.alias_generators import to_camel, to_snake


class Login(BaseModel):
    admin_id: str = Field(..., alias="adminId")
    password: str


class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    
    model_config = ConfigDict(
        alias_generator=AliasGenerator(
            validation_alias=to_camel, serialization_alias=to_snake
        )
    )