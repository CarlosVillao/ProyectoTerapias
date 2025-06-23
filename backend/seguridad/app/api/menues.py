from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.menu import MenuCreate, MenuOut
from app.crud import menu as crud_menu
from app.database import SessionLocal

router = APIRouter(prefix="/menus", tags=["Menús"])

# Dependencia de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=MenuOut)
def crear_menu(datos: MenuCreate, db: Session = Depends(get_db)):
    return crud_menu.crear_menu(db, datos)

@router.get("/", response_model=list[MenuOut])
def listar_menus(db: Session = Depends(get_db)):
    return crud_menu.listar_menus(db)
