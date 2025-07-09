from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PaymentMethodBase(BaseModel):
    pme_name: str = Field(..., max_length=40)
    pme_require_references: bool = False

class PaymentMethodCreate(PaymentMethodBase):
    user_created: str
    date_created: Optional[datetime] = None

class PaymentMethodRead(PaymentMethodBase):
    pme_id: int
    date_created: datetime
    user_created: str

    class Config:
        orm_mode = True
