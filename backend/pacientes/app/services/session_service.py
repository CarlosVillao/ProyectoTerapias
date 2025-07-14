from app.crud.session_crud import get_sessions, create_session, get_session, get_sessions_by_patient, update_session_status
from app.schemas.session_schema import SessionCreate

def list_sessions_service(skip: int = 0, limit: int = 100):
    """
    Servicio para listar controles de sesiones.
    """
    return get_sessions(skip, limit)

def create_session_service(data: SessionCreate):
    """
    Servicio para crear un nuevo control de sesión.
    """
    return create_session(data)

def get_session_service(session_id: int):
    """
    Servicio para obtener un control de sesión por ID.
    """
    return get_session(session_id)

def get_sessions_by_patient_service(patient_id: int):
    """
    Servicio para obtener las sesiones de un paciente específico.
    """
    return get_sessions_by_patient(patient_id)

def update_session_status_service(session_id: int, consumed: bool, execution_date=None):
    """
    Servicio para actualizar el estado de una sesión.
    """
    return update_session_status(session_id, consumed, execution_date)
