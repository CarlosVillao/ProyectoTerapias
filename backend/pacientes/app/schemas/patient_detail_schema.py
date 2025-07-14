from typing import List, Optional
from pydantic import BaseModel

class PatientAllergy(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class PatientDisease(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

class MedicalHistoryEntry(BaseModel):
    id: int
    date: str
    diagnosis: str
    treatment: Optional[str] = None
    notes: Optional[str] = None

class PatientDetail(BaseModel):
    id: int
    first_name: str
    last_name: str
    birth_date: Optional[str] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    allergies: List[PatientAllergy] = []
    diseases: List[PatientDisease] = []
    medical_history: List[MedicalHistoryEntry] = []
