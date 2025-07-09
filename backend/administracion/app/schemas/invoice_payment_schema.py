from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal
from typing import Optional

class InvoicePaymentBase(BaseModel):
    inp_invoice_id: int
    inp_payment_method_id: int
    inp_amount: Decimal

class InvoicePaymentCreate(InvoicePaymentBase):
    inp_reference: Optional[str] = Field(None, max_length=100)
    user_created: str
    date_created: Optional[datetime] = None

class InvoicePaymentRead(InvoicePaymentBase):
    inp_id: int
    inp_reference: Optional[str]
    date_created: datetime
    user_created: str

    class Config:
        orm_mode = True
