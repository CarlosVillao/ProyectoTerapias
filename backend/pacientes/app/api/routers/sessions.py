from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.session_schema import SessionCreate, SessionRead, SessionWithDetails
from app.crud.session_crud import get_sessions, create_session, get_session, get_sessions_by_patient, update_session_status
from datetime import datetime
# from app.api.deps import get_current_user

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.get("/", response_model=List[SessionRead])
def list_sessions(skip: int = 0, limit: int = 100):
    """
    Lista los controles de sesiones con paginación.
    """
    return get_sessions(skip, limit)

@router.post("/", response_model=SessionRead, status_code=status.HTTP_201_CREATED)
def add_session(data: SessionCreate):
    """
    Crea un nuevo control de sesión.
    """
    return create_session(data)

@router.get("/{id}", response_model=SessionRead)
def get_session_by_id(id: int):
    """
    Obtiene un control de sesión por ID.
    """
    session = get_session(id)
    if not session:
        raise HTTPException(status_code=404, detail="Control de sesión no encontrado")
    return session

@router.get("/patient/{patient_id}", response_model=List[SessionWithDetails])
def get_sessions_by_patient_id(patient_id: int):
    """
    Obtiene todas las sesiones de un paciente específico.
    """
    sessions = get_sessions_by_patient(patient_id)
    return sessions

@router.patch("/{session_id}/status", response_model=SessionRead)
def update_session_consumed_status(session_id: int, consumed: bool, execution_date: datetime = None):
    """
    Actualiza el estado de consumo de una sesión.
    """
    session = update_session_status(session_id, consumed, execution_date)
    if not session:
        raise HTTPException(status_code=404, detail="Control de sesión no encontrado")
    return session
