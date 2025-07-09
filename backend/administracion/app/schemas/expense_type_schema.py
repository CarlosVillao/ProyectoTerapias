from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ExpenseTypeBase(BaseModel):
    ext_name: str = Field(..., max_length=40)
    ext_description: Optional[str] = Field(None, max_length=100)

class ExpenseTypeCreate(ExpenseTypeBase):
    user_created: str
    date_created: Optional[datetime] = None

class ExpenseTypeRead(ExpenseTypeBase):
    ext_id: int
    date_created: datetime
    user_created: str

    class Config:
        orm_mode = True
