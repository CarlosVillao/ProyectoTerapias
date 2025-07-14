from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class GenreBase(BaseModel):
    gen_name: str = Field(..., max_length=40)
    gen_description: Optional[str] = Field(None, max_length=100)

class GenreCreate(GenreBase):
    user_created: str
    date_created: Optional[datetime] = None

class GenreRead(GenreBase):
    gen_id: int
    date_created: datetime
    user_created: str

    class Config:
        from_attributes = True
