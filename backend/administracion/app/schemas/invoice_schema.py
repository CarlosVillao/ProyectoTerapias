from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime
from decimal import Decimal

class InvoiceBase(BaseModel):
    inv_client_id: int
    inv_patient_id: int
    inv_subtotal: Decimal
    inv_discount: Decimal = Decimal("0.00")
    inv_tax: Decimal = Decimal("0.00")

class InvoiceCreate(InvoiceBase):
    inv_number: str = Field(..., max_length=20)
    inv_date: Optional[datetime] = None
    user_created: str
    date_created: Optional[datetime] = None

class InvoiceRead(InvoiceBase):
    inv_id: int
    inv_number: str
    inv_date: datetime
    inv_grand_total: Decimal
    date_created: datetime
    user_created: str

    class Config:
        orm_mode = True
