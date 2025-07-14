from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PaymentMethodBase(BaseModel):
    pym_name: str = Field(..., max_length=40)
    pym_description: Optional[str] = Field(None, max_length=100)

class PaymentMethodCreate(PaymentMethodBase):
    user_created: str
    date_created: Optional[datetime] = None

class PaymentMethodRead(PaymentMethodBase):
    pym_id: int
    date_created: datetime
    user_created: str

    class Config:
        from_attributes = True
