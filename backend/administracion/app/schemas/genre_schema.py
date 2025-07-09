from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class GenreBase(BaseModel):
    genre_name: str = Field(..., max_length=100)
    state: Optional[bool] = True

class GenreRead(GenreBase):
    id: int
    user_created: str
    date_created: datetime
    user_modified: Optional[str]
    date_modified: Optional[datetime]
    user_deleted: Optional[str]
    date_deleted: Optional[datetime]

    class Config:
        orm_mode = True
