# app/routes/auth_routes.py

print("✅ auth_routes.py cargado")

from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import JSONResponse
from app.schemas.auth_schema import (
    LoginRequest, RoleSelectionRequest, LoginResponse,
    ChangePasswordRequest, PasswordRecoveryRequest,
    PasswordResetRequest, ChangeActiveRoleRequest
)
from app.services.auth_service import (
    login_user, seleccionar_rol_activo, cambiar_contrasena,
    enviar_codigo_recuperacion, resetear_contrasena,
    cambiar_rol_activo
)
from app.utils.jwt_handler import create_access_token, decode_token  # <— corregido

router = APIRouter()
print("📌 auth_routes.py: router inicializado")


@router.post("/login")
def login(data: LoginRequest):
    try:
        print("🔐 Dentro de router-login")
        result = login_user(data.email, data.password)
        print("✅ Resultado login_user:", result)
        return {
            "user_id": result["user"]["user_id"],
            "email": result["user"]["user_mail"],
            "roles": result["roles"]
        }
    except HTTPException as e:
        print("❌ Error HTTP en login:", str(e.detail))
        raise e
    except Exception as e:
        print("❌ Error interno en login:", str(e))
        raise HTTPException(status_code=500, detail="Error interno en autenticación")


@router.post("/seleccionar-rol", response_model=LoginResponse)
def seleccionar_rol(data: RoleSelectionRequest, request: Request):
    try:
        ip = request.client.host
        host = request.headers.get("host", "unknown")
        token, login_id = seleccionar_rol_activo(data.user_id, data.rol_id, ip, host)
        return LoginResponse(
            token=token,
            user_id=data.user_id,
            rol_id=data.rol_id,
            login_id=login_id,
            message="Inicio de sesión exitoso"
        )
    except Exception as e:
        print("❌ Error al seleccionar rol:", str(e))
        raise HTTPException(status_code=500, detail="Error al seleccionar rol")


@router.post("/cambiar-password")
def cambiar_password(data: ChangePasswordRequest):
    try:
        return cambiar_contrasena(data.user_id, data.old_password, data.new_password)
    except Exception as e:
        print("❌ Error al cambiar contraseña:", str(e))
        raise HTTPException(status_code=500, detail="Error al cambiar contraseña")


@router.post("/recuperar-password")
def solicitar_codigo(data: PasswordRecoveryRequest):
    try:
        return enviar_codigo_recuperacion(data.email)
    except Exception as e:
        print("❌ Error al solicitar código:", str(e))
        raise HTTPException(status_code=500, detail="Error al solicitar código de recuperación")


@router.post("/resetear-password")
def resetear_password(data: PasswordResetRequest):
    try:
        return resetear_contrasena(data.email, data.token, data.new_password)
    except Exception as e:
        print("❌ Error al resetear contraseña:", str(e))
        raise HTTPException(status_code=500, detail="Error al resetear contraseña")


@router.post("/cambiar-rol-activo")
def cambiar_rol(data: ChangeActiveRoleRequest, request: Request):
    try:
        ip = request.client.host
        host = request.headers.get("host", "unknown")
        result = cambiar_rol_activo(
            login_id=data.login_id,
            user_id=data.user_id,
            new_rol_id=data.new_rol_id,
            ip=ip,
            host=host
        )
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    except Exception as e:
        print("❌ Error al cambiar rol activo:", str(e))
        raise HTTPException(status_code=422, detail="Error al cambiar el rol activo")


@router.post("/validate-token")
def validate_token(payload: dict):
    """
    Recibe JSON {"token": "<JWT>"} y devuelve 200 OK con el payload decodificado
    o 401 Unauthorized si el token no es válido.
    """
    token = payload.get("token")
    if not token:
        raise HTTPException(status_code=400, detail="Token missing in request body")
    try:
        decoded = decode_token(token)  # <-- usa decode_token, no decode_access_token
        return {"user": decoded}
    except HTTPException as e:
        raise e
    except Exception as e:
        print("❌ Unexpected error validating token:", str(e))
        raise HTTPException(status_code=500, detail="Error validating token")
