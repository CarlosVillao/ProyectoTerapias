# app/routes/menu_routes.py
from fastapi import APIRouter, Depends
from app.services.menu_service import listar_menus_por_rol
from app.utils.jwt_handler import decode_token
from fastapi import Header, HTTPException

router = APIRouter()

def obtener_rol_desde_token(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        payload = decode_token(token)
        return payload.get("rol_id")
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

@router.get("/por-rol")
def obtener_menus(rol_id: int = Depends(obtener_rol_desde_token)):
    return listar_menus_por_rol(rol_id)
