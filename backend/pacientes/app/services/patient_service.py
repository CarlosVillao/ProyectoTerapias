from app.crud.patient_crud import get_patients, create_patient, get_patient, get_patient_allergies, get_patient_diseases
from app.schemas.patient_schema import PatientCreate

def list_patients_service(skip: int = 0, limit: int = 100):
    """
    Servicio para listar historiales médicos de pacientes.
    """
    return get_patients(skip, limit)

def create_patient_service(data: PatientCreate):
    """
    Servicio para crear un nuevo historial médico de paciente.
    """
    return create_patient(data)

def get_patient_service(patient_id: int):
    """
    Servicio para obtener un historial médico de paciente por ID.
    """
    return get_patient(patient_id)

def get_patient_allergies_service(patient_id: int):
    """
    Servicio para obtener las alergias de un paciente.
    """
    return get_patient_allergies(patient_id)

def get_patient_diseases_service(patient_id: int):
    """
    Servicio para obtener las enfermedades de un paciente.
    """
    return get_patient_diseases(patient_id)
