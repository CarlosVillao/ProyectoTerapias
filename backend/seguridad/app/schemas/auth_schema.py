# app/schemas/auth_schema.py
print("✅ auth_schema.py cargado sin errores")

from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RoleSelectionRequest(BaseModel):
    user_id: int
    rol_id: int

class LoginResponse(BaseModel):
    token: str
    user_id: int
    rol_id: int
    message: str

# app/schemas/auth_schema.py (complemento)
class ChangePasswordRequest(BaseModel):
    user_id: int
    old_password: str
    new_password: str

# app/schemas/auth_schema.py (extensión)
class PasswordRecoveryRequest(BaseModel):
    email: str

class PasswordResetRequest(BaseModel):
    email: str
    token: str
    new_password: str

# app/schemas/auth_schema.py (complemento)
class ChangeActiveRoleRequest(BaseModel):
    login_id: int
    user_id: int
    new_rol_id: int
