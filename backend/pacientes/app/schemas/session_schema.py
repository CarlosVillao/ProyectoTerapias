from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SessionBase(BaseModel):
    invoice_id: int
    product_id: int
    session_number: int
    scheduled_date: datetime
    execution_date: Optional[datetime] = None
    therapy_type_id: int
    medical_staff_id: int
    consumed: Optional[bool] = False
    state: Optional[bool] = True

class SessionCreate(SessionBase):
    user_created: str
    date_created: Optional[datetime] = None

class SessionRead(SessionBase):
    sec_id: int
    user_created: str
    date_created: datetime
    user_modified: Optional[str] = None
    date_modified: Optional[datetime] = None
    user_deleted: Optional[str] = None
    date_deleted: Optional[datetime] = None

    class Config:
        from_attributes = True

class SessionWithDetails(SessionRead):
    patient_id: Optional[int] = None
    product_name: Optional[str] = None
    therapy_type_name: Optional[str] = None

    class Config:
        from_attributes = True
