from app.crud.genre_crud import update_genre, delete_genre
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

@router.put("/{genre_id}", response_model=GenreRead, dependencies=[Depends(get_current_user)])
async def update_genre_endpoint(genre_id: int, data: dict):
    updated = update_genre(genre_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Genre not found")
    return get_genre(genre_id)

@router.delete("/{genre_id}", response_model=dict, dependencies=[Depends(get_current_user)])
async def delete_genre_endpoint(genre_id: int):
    success = delete_genre(genre_id)
    if not success:
        raise HTTPException(status_code=404, detail="Genre not found")
    return {"deleted": True}
