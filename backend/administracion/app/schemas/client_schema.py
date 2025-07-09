from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ClientBase(BaseModel):
    cli_person_id: int
    cli_identification: str = Field(..., max_length=20)
    cli_name: str = Field(..., max_length=100)
    cli_address_bill: Optional[str] = Field(None, max_length=200)
    cli_mail_bill: Optional[str] = Field(None, max_length=100)
    cli_state: Optional[bool] = True

class ClientCreate(ClientBase):
    user_created: str = Field(..., max_length=100)
    date_created: Optional[datetime] = None

class ClientRead(ClientBase):
    cli_id: int
    user_created: str
    date_created: datetime
    user_modified: Optional[str]
    date_modified: Optional[datetime]
    user_deleted: Optional[str]
    date_deleted: Optional[datetime]

    #class Config:
    #    orm_mode = True