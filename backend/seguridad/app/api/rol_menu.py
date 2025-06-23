from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas.rol_menu import RolMenuCreate
from app.crud import rol_menu as crud_rol_menu

router = APIRouter(prefix="/rol-menu", tags=["Rol-Menú"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def asignar_menu(datos: RolMenuCreate, db: Session = Depends(get_db)):
    return crud_rol_menu.asignar_menu_a_rol(db, datos)
