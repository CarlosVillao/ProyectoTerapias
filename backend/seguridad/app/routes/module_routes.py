# app/routes/module_routes.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/", summary="Ruta base de módulos")
def listar_modulos():
    return {"message": "Módulos operativos"}
