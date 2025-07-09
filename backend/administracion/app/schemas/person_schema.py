from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional

class PersonBase(BaseModel):
    per_identification: str = Field(..., max_length=20)
    per_names: str = Field(..., max_length=100)
    per_surnames: str = Field(..., max_length=100)
    per_genre_id: int
    per_marital_status_id: int
    per_country: Optional[str] = Field(None, max_length=100)
    per_city: Optional[str] = Field(None, max_length=100)
    per_address: Optional[str] = Field(None, max_length=200)
    per_phone: Optional[str] = Field(None, max_length=100)
    per_mail: Optional[EmailStr]
    per_birth_date: Optional[datetime]
    per_state: Optional[bool] = True

class PersonCreate(PersonBase):
    user_created: str = Field(..., max_length=100)
    date_created: Optional[datetime] = None

class PersonRead(PersonBase):
    per_id: int
    user_created: str
    date_created: datetime
    user_modified: Optional[str]
    date_modified: Optional[datetime]
    user_deleted: Optional[str]
    date_deleted: Optional[datetime]

    #class Config:
    #    orm_mode = True