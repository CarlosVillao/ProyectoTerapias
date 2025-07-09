from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.genre_schema import GenreRead
from app.crud.genre_crud import get_all_genres, get_genre
from app.api.deps import get_current_user

router = APIRouter(prefix="/genres", tags=["genres"])

@router.get("/", response_model=List[GenreRead], dependencies=[Depends(get_current_user)])
async def list_genres():
    return get_all_genres()

@router.get("/{genre_id}", response_model=GenreRead, dependencies=[Depends(get_current_user)])
async def read_genre(genre_id: int):
    rec = get_genre(genre_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Genre not found")
    return rec
