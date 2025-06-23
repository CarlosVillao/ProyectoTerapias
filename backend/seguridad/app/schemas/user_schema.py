# app/schemas/user_schema.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UsuarioBase(BaseModel):
    email: EmailStr
    password: str
    state: Optional[bool] = True
    roles: List[int]  # lista de IDs de roles

class UsuarioOut(BaseModel):
    id: int
    email: str
    state: bool
    roles: List[str]
