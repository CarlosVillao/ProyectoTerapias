from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.marital_status_schema import MaritalStatusRead
from app.crud.marital_status_crud import get_all_marital_statuses, get_marital_status
from app.api.deps import get_current_user

router = APIRouter(prefix="/marital-status", tags=["marital-status"])

@router.get("/", response_model=List[MaritalStatusRead], dependencies=[Depends(get_current_user)])
async def list_marital_statuses():
    return get_all_marital_statuses()

@router.get("/{ms_id}", response_model=MaritalStatusRead, dependencies=[Depends(get_current_user)])
async def read_marital_status(ms_id: int):
    rec = get_marital_status(ms_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Marital status not found")
    return rec
