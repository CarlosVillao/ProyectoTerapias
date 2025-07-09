from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.person_schema import PersonCreate, PersonRead
from app.crud.person_crud import create_person, get_person
from app.api.deps import get_current_user

router = APIRouter(prefix="/persons", tags=["persons"])

@router.post("/", response_model=PersonRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_user)])
async def add_person(person: PersonCreate):
    return create_person(person)

@router.get("/{per_id}", response_model=PersonRead, dependencies=[Depends(get_current_user)])
async def read_person(per_id: int):
    result = get_person(per_id)
    if not result:
        raise HTTPException(status_code=404, detail="Person not found")
    return result