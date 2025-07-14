from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.client_schema import ClientCreate, ClientRead
from app.services.clients_service import (
    list_clients_service,
    create_client_service
)
from app.crud.client_crud import update_client, delete_client, get_client_by_id_endpoint
from app.api.deps import get_current_user

router = APIRouter(prefix="/clients", tags=["clients"])

@router.get("/", response_model=List[ClientRead], dependencies=[Depends(get_current_user)])
async def list_clients(skip: int = 0, limit: int = 100):
    return list_clients_service(skip, limit)

@router.get("/{cli_id}", dependencies=[Depends(get_current_user)])
def get_client_by_id(cli_id: int):
    return get_client_by_id_endpoint(cli_id)

@router.put("/{client_id}", response_model=ClientRead, dependencies=[Depends(get_current_user)])
async def update_client_endpoint(client_id: int, data: dict):
    updated = update_client(client_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Client not found")
    return updated

@router.delete("/{client_id}", response_model=dict, dependencies=[Depends(get_current_user)])
async def delete_client_endpoint(client_id: int):
    success = delete_client(client_id)
    if not success:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"deleted": True}

@router.post("/", response_model=ClientRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_user)])
async def add_client(client: ClientCreate):
    return create_client_service(client)
