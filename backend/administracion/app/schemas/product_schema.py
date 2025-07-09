from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional

class ProductBase(BaseModel):
    pro_code: str
    pro_name: str
    pro_description: Optional[str]
    pro_price: Decimal
    pro_total_sessions: int
    pro_duration_days: Optional[int]
    pro_image_url: Optional[str]
    pro_therapy_type_id: int
    pro_state: Optional[bool] = True

class ProductCreate(ProductBase):
    user_created: str
    date_created: Optional[datetime] = None

class ProductRead(ProductBase):
    pro_id: int
    user_created: str
    date_created: datetime
    user_modified: Optional[str]
    date_modified: Optional[datetime]
    user_deleted: Optional[str]
    date_deleted: Optional[datetime]

    class Config:
        orm_mode = True
