from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.person_schema import PersonCreate, PersonRead
from app.services.persons_service import (
    create_person_service,
    get_person_service,
    list_persons_service
)
from app.crud.person_crud import update_person, delete_person
from app.api.deps import get_current_user

router = APIRouter(prefix="/persons", tags=["persons"])


@router.get("/", response_model=List[PersonRead], dependencies=[Depends(get_current_user)])
async def list_persons(skip: int = 0, limit: int = 100):
    return list_persons_service(skip, limit)

@router.post("/", response_model=PersonRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_user)])
async def add_person(person: PersonCreate):
    return create_person_service(person)

@router.get("/{per_id}", response_model=PersonRead, dependencies=[Depends(get_current_user)])
async def read_person(per_id: int):
    result = get_person_service(per_id)
    if not result:
        raise HTTPException(status_code=404, detail="Person not found")
    return result

@router.put("/{per_id}", response_model=PersonRead, dependencies=[Depends(get_current_user)])
async def update_person_endpoint(per_id: int, data: dict):
    updated = update_person(per_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Person not found")
    return get_person_service(per_id)

@router.delete("/{per_id}", response_model=dict, dependencies=[Depends(get_current_user)])
async def delete_person_endpoint(per_id: int):
    success = delete_person(per_id)
    if not success:
        raise HTTPException(status_code=404, detail="Person not found")
    return {"deleted": True}
