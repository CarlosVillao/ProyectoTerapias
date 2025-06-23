from fastapi import APIRouter, Form, HTTPException, status
from app.db.connection import get_connection
from app.config import settings
import bcrypt
import jwt

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    try:
        conn = get_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM usuarios WHERE email = %s", (username,))
        usuario = cur.fetchone()
        cur.close()
        conn.close()

        if not usuario:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado")

        if not bcrypt.checkpw(password.encode("utf-8"), usuario["clave"].encode("utf-8")):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Contraseña incorrecta")

        payload = {
            "sub": usuario["email"],
            "id": usuario["id"]
        }

        token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

        return {"access_token": token, "token_type": "bearer"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")
