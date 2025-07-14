from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.patient_schema import PatientCreate, PatientRead
from app.services.patients_service import (
    list_patients_service,
    create_patient_service,
    get_patient_service
)
from app.crud.patient_crud import update_patient, delete_patient
from app.api.deps import get_current_user

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("/", response_model=List[PatientRead], dependencies=[Depends(get_current_user)])
def list_patients(skip: int = 0, limit: int = 100):
    return list_patients_service(skip, limit)


@router.post(
    "/",
    response_model=PatientRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)]
)
def add_patient(data: PatientCreate):
    return create_patient_service(data)

@router.put("/{patient_id}", response_model=PatientRead, dependencies=[Depends(get_current_user)])
async def update_patient_endpoint(patient_id: int, data: dict):
    updated = update_patient(patient_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Patient not found")
    return get_patient_service(patient_id)

@router.delete("/{patient_id}", response_model=dict, dependencies=[Depends(get_current_user)])
async def delete_patient_endpoint(patient_id: int):
    success = delete_patient(patient_id)
    if not success:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"deleted": True}
