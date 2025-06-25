# app/routes/auth_routes.py
print("✅ auth_routes.py cargado")

from fastapi import APIRouter, Request, HTTPException
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
    except Exception as e:
        print("❌ Error dentro del login:", str(e))
        raise HTTPException(status_code=500, detail="Error interno")

@router.post("/seleccionar-rol", response_model=LoginResponse)
def seleccionar_rol(data: RoleSelectionRequest, request: Request):
    ip = request.client.host
    host = request.headers.get("host", "unknown")
    print(f"📌 Seleccionar rol - IP: {ip}, Host: {host}")
    token, login_id = seleccionar_rol_activo(data.user_id, data.rol_id, ip, host)
    return LoginResponse(
        token=token,
        user_id=data.user_id,
        rol_id=data.rol_id,
        login_id=login_id,
        message="Inicio de sesión exitoso"
    )

@router.post("/cambiar-password")
def cambiar_password(data: ChangePasswordRequest):
    print("🔁 Cambio de contraseña solicitado")
    return cambiar_contrasena(data.user_id, data.old_password, data.new_password)

@router.post("/recuperar-password")
def solicitar_codigo(data: PasswordRecoveryRequest):
    print("📨 Solicitud de código de recuperación")
    return enviar_codigo_recuperacion(data.email)

@router.post("/resetear-password")
def resetear_password(data: PasswordResetRequest):
    print("🔁 Resetear contraseña")
    return resetear_contrasena(data.email, data.token, data.new_password)

@router.post("/cambiar-rol-activo")
def cambiar_rol(data: ChangeActiveRoleRequest, request: Request):
    ip = request.client.host
    host = request.headers.get("host", "unknown")
    print(f"🔄 Cambio de rol activo - IP: {ip}, Host: {host}")
    return cambiar_rol_activo(
        login_id=data.login_id,
        user_id=data.user_id,
        new_rol_id=data.new_rol_id,
        ip=ip,
        host=host
    )
