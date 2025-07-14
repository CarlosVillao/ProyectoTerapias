from pydantic import BaseModel, Field
from datetime import date, datetime
from decimal import Decimal
from typing import Optional

class ExpenseBase(BaseModel):
    exp_type_id: int
    exp_payment_method_id: int
    exp_amount: Decimal
    exp_description: Optional[str] = Field(None, max_length=200)

class ExpenseCreate(ExpenseBase):
    exp_date: Optional[date] = None
    user_created: str
    date_created: Optional[datetime] = None

class ExpenseRead(ExpenseBase):
    exp_id: int
    exp_date: date
    date_created: datetime
    user_created: str

    class Config:
        from_attributes = True
