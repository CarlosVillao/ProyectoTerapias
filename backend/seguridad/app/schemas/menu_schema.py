# app/schemas/menu_schema.py
from pydantic import BaseModel
from typing import Optional

class MenuOut(BaseModel):
    id: int
    name: str
    icon: Optional[str]
    route: Optional[str]
    order: Optional[int]
