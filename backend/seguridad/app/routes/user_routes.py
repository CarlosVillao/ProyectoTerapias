# app/routes/user_routes.py
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import UsuarioBase
from app.services.user_service import crear_usuario, listar_usuarios
from app.utils.auth_dependency import obtener_usuario_desde_token

router = APIRouter()

@router.post("/", summary="Crear usuario con roles")
def crear(data: UsuarioBase):
    return crear_usuario(data)

@router.get("/", summary="Listar usuarios con sus roles")
def listar():
    return listar_usuarios()

@router.get("/protegido")
def prueba_protegida(datos=Depends(obtener_usuario_desde_token)):
    return {"msg": "Ruta protegida", "usuario": datos}

@router.get("/solo-admin")
def solo_admin(datos=Depends(obtener_usuario_desde_token)):
    if datos["rol_id"] != 1:
        raise HTTPException(status_code=403, detail="No autorizado para este recurso")
    return {"msg": "Acceso permitido solo a rol_id = 1"}
