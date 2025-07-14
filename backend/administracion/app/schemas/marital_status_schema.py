from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MaritalStatusBase(BaseModel):
    mst_name: str = Field(..., max_length=40)
    mst_description: Optional[str] = Field(None, max_length=100)

class MaritalStatusCreate(MaritalStatusBase):
    user_created: str
    date_created: Optional[datetime] = None

class MaritalStatusRead(MaritalStatusBase):
    mst_id: int
    date_created: datetime
    user_created: str

    class Config:
        from_attributes = True
