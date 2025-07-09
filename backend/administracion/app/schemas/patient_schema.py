from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PatientBase(BaseModel):
    pat_person_id: int
    pat_client_id: int
    pat_code: Optional[str]
    pat_medical_conditions: Optional[str]
    pat_allergies: Optional[str]
    pat_blood_type: Optional[str]
    pat_emergency_contact_name: Optional[str]
    pat_emergency_contact_phone: Optional[str]
    pat_state: Optional[bool] = True

class PatientCreate(PatientBase):
    user_created: str
    date_created: Optional[datetime] = None

class PatientRead(PatientBase):
    pat_id: int
    user_created: str
    date_created: datetime
    user_modified: Optional[str]
    date_modified: Optional[datetime]
    user_deleted: Optional[str]
    date_deleted: Optional[datetime]

    class Config:
        orm_mode = True
