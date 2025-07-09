from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.patient_schema import PatientCreate, PatientRead
from app.crud.patient_crud import get_patient, create_patient
from app.api.deps import get_current_user

router = APIRouter(prefix="/patients", tags=["patients"])

@router.get("/", response_model=List[PatientRead], dependencies=[Depends(get_current_user)])
#def list_patients(skip: int = 0, limit: int = 100):
    # (suponiendo que ya existe get_patients)
#    return get_patients(skip, limit)

@router.post(
    "/", 
    response_model=PatientRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)]
)
def add_patient(data: PatientCreate):
    # opcional: validar person y client antes de insertar...
    return create_patient(data)
