from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

class InvoiceDetailBase(BaseModel):
    ind_invoice_id: int
    ind_product_id: int
    ind_quantity: int
    ind_unit_price: Decimal

class InvoiceDetailCreate(InvoiceDetailBase):
    user_created: str
    date_created: Optional[datetime] = None

class InvoiceDetailRead(InvoiceDetailBase):
    ind_id: int
    ind_total: Decimal
    date_created: datetime
    user_created: str

    class Config:
        orm_mode = True
