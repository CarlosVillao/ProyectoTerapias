# app/utils/auth_dependency.py

from fastapi import Header, HTTPException
from app.utils.jwt_handler import decode_token

def obtener_usuario_desde_token(authorization: str = Header(...)):
    """
    Extrae y decodifica el token JWT enviado en el encabezado Authorization.
    Valida su estructura y contenido (user_id y rol_id).
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Encabezado de autorización malformado o faltante")
    
    token = authorization.split(" ")[1]

    try:
        payload = decode_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token inválido: {str(e)}")

    user_id = payload.get("user_id")
    rol_id = payload.get("rol_id")

    if not user_id or not rol_id:
        raise HTTPException(status_code=403, detail="Token inválido o incompleto")

    return {
        "user_id": user_id,
        "rol_id": rol_id
    }
