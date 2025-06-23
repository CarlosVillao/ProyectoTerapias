# app/routes/rol_routes.py
from fastapi import APIRouter
from app.schemas.rol_schema import RolBase
from app.services.rol_service import crear_rol, listar_roles

router = APIRouter()

@router.post("/", summary="Crear rol con sus permisos de menú")
def crear(data: RolBase):
    return crear_rol(data)

@router.get("/", summary="Listar roles y sus menús asignados")
def listar():
    return listar_roles()
