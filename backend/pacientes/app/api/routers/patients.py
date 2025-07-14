from fastapi import APIRouter, HTTPException

from app.crud.patient_crud import get_patients, create_patient, get_patient, get_patient_allergies, get_patient_diseases, get_patient_history
from app.schemas.patient_schema import PatientCreate, PatientRead, PatientAllergy, PatientDisease
from app.schemas.patient_detail_schema import PatientDetail
from typing import List

router = APIRouter(prefix="/patients", tags=["patients"])

# Endpoint para consultar el historial médico completo de un paciente
@router.get("/history/{pat_id}", response_model=List[PatientRead])
def get_patient_history_endpoint(pat_id: int):
    """
    Devuelve el historial médico completo de un paciente (por pat_id).
    """
    return get_patient_history(pat_id)

@router.get("/", response_model=List[PatientDetail])
def list_patients(skip: int = 0, limit: int = 100):
    """
    Lista los historiales médicos de pacientes con paginación.
    """
    return get_patients(skip, limit)

@router.post("/", response_model=PatientRead, status_code=201)
def add_patient(data: PatientCreate):
    """
    Crea un nuevo historial médico de paciente.
    """
    return create_patient(data)

@router.get("/{id}", response_model=PatientDetail)
def get_patient_by_id(id: int):
    """
    Obtiene un historial médico de paciente por ID.
    """
    patient = get_patient(id)
    if not patient:
        raise HTTPException(status_code=404, detail="Historial médico no encontrado")
    return patient

@router.get("/{patient_id}/allergies", response_model=List[PatientAllergy])
def get_patient_allergies_by_id(patient_id: int):
    """
    Obtiene las alergias de un paciente específico.
    """
    allergies = get_patient_allergies(patient_id)
    return allergies

@router.get("/{patient_id}/diseases", response_model=List[PatientDisease])
def get_patient_diseases_by_id(patient_id: int):
    """
    Obtiene las enfermedades de un paciente específico.
    """
    diseases = get_patient_diseases(patient_id)
    return diseases
