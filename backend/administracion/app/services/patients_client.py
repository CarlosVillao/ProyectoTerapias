from app.crud.patient_crud import get_patients, create_patient, get_patient
from app.schemas.patient_schema import PatientCreate

def list_patients_service(skip: int = 0, limit: int = 100):
    """Obtiene la lista de pacientes."""
    return get_patients(skip, limit)

def create_patient_service(data: PatientCreate):
    """Crea un nuevo paciente."""
    return create_patient(data)

def get_patient_service(id: int):
    """Obtiene un paciente por su ID."""
    return get_patient(id)
