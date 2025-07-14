# app/routes/user_routes.py
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.user_schema import UsuarioBase
from app.services.user_service import crear_usuario, listar_usuarios, obtener_usuario_por_id
from app.utils.auth_dependency import obtener_usuario_desde_token

router = APIRouter()

@router.post("/", summary="Crear usuario con roles")
def crear(data: UsuarioBase):
    return crear_usuario(data)

@router.get("/", summary="Listar usuarios con sus roles")
def listar():
    return listar_usuarios()

@router.get("/{user_id}", summary="Obtener un usuario por ID con roles y empresas")
def get_user(user_id: int):
    user = obtener_usuario_por_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.get("/protegido")
def prueba_protegida(datos=Depends(obtener_usuario_desde_token)):
    return {"msg": "Ruta protegida", "usuario": datos}

@router.get("/solo-admin")
def solo_admin(datos=Depends(obtener_usuario_desde_token)):
    if datos["rol_id"] != 1:
        raise HTTPException(status_code=403, detail="No autorizado para este recurso")
    return {"msg": "Acceso permitido solo a rol_id = 1"}
