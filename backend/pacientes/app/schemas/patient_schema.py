from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PatientBase(BaseModel):
    patient_id: int
    primary_complaint: Optional[str] = None
    onset_date: Optional[datetime] = None
    related_trauma: Optional[bool] = False
    current_treatment: Optional[str] = None
    notes: Optional[str] = None

class PatientCreate(PatientBase):
    user_created: str
    date_created: Optional[datetime] = None

class PatientRead(PatientBase):
    hist_id: int
    user_created: str
    date_created: datetime
    user_modified: Optional[str] = None
    date_modified: Optional[datetime] = None
    user_deleted: Optional[str] = None
    date_deleted: Optional[datetime] = None

    class Config:
        from_attributes = True

class PatientAllergy(BaseModel):
    pa_id: int
    pa_patient_id: int
    pa_allergy_id: int
    pa_reaction_description: Optional[str] = None
    al_name: str
    al_description: Optional[str] = None
    user_created: str
    date_created: datetime

    class Config:
        from_attributes = True

class PatientDisease(BaseModel):
    pd_id: int
    pd_patient_id: int
    pd_disease_id: int
    pd_is_current: bool
    pd_notes: Optional[str] = None
    dis_name: str
    dis_description: Optional[str] = None
    dst_name: str
    user_created: str
    date_created: datetime

    class Config:
        from_attributes = True
