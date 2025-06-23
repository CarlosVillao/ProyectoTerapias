# app/utils/jwt_handler.py

from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException
from app.config.settings import settings

# Asegúrate de definir esto en settings.py si no existe
JWT_ALGORITHM = "HS256"  # puedes mover esto a settings si lo deseas

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=8)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )
    return encoded_jwt

def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
