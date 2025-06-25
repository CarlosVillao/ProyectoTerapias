# app/schemas/user_schema.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UsuarioBase(BaseModel):
    person_id: int               # << persona ya existente
    login_id: str
    email: EmailStr
    password: str
    state: bool = True
    roles: List[int]             # lista de ID de roles

class UsuarioOut(BaseModel):
    id: int
    email: str
    state: bool
    roles: List[str]
