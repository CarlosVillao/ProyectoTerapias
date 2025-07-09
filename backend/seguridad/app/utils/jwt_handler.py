# app/utils/jwt_handler.py

from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException
from app.config.settings import settings

# Algoritmo y secreto
JWT_ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=8)) -> str:
    """
    Crea un JWT con payload `data` y expiración `expires_delta`.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )
    return encoded_jwt

def decode_token(token: str) -> dict:
    """
    Decodifica y verifica un JWT. Lanza HTTPException(401) si falla.
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
