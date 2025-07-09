# app/utils/auth_dependency.py

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_handler import decode_token

# Definir el esquema de seguridad tipo Bearer para Swagger y dependencias
bearer_scheme = HTTPBearer(auto_error=True)

def obtener_usuario_desde_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    """
    Extrae el usuario autenticado desde el token JWT proporcionado en el encabezado Authorization.
    """
    try:
        token = credentials.credentials  # Extrae el token del encabezado
        payload = decode_token(token)    # Decodifica el token JWT
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
