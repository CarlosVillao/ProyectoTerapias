# app/schemas/rol_schema.py
from pydantic import BaseModel
from typing import List, Optional

class RolBase(BaseModel):
    name: str
    description: Optional[str] = None
    state: Optional[bool] = True
    menus: List[int]  # IDs de menús permitidos

class RolOut(BaseModel):
    id: int
    name: str
    description: Optional[str]
    state: bool
    menus: List[str]
