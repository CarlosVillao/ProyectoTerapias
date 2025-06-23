from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.rol import RolCreate, RolOut
from app.crud import rol as crud_rol
from app.database import SessionLocal

router = APIRouter(prefix="/roles", tags=["Roles"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=RolOut)
def crear_rol(datos: RolCreate, db: Session = Depends(get_db)):
    return crud_rol.crear_rol(db, datos)

@router.get("/", response_model=list[RolOut])
def listar_roles(db: Session = Depends(get_db)):
    return crud_rol.listar_roles(db)
