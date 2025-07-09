#import traceback
#from fastapi import APIRouter, Depends, HTTPException, status
#from typing import List

#from app.schemas.client_schema import ClientCreate, ClientRead
#from app.crud.client_crud import get_clients, create_client
#from app.api.deps import get_current_user
##prefix="/clients", 
#router = APIRouter(tags=["clients"])

#@router.get("/", response_model=List[ClientRead], dependencies=[Depends(get_current_user)])
#async def list_clients(skip: int = 0, limit: int = 100):
#    try:
#        return get_clients(skip, limit)
#    except Exception as e:
#        traceback.print_exc()
#        raise HTTPException(status_code=500, detail=str(e))

#@router.post("/", response_model=ClientRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_user)])
#async def create_new_client(client: ClientCreate):
#    try:
#        return create_client(client)
#    except Exception as e:
#        raise HTTPException(status_code=500, detail=str(e))
    
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.client_schema import ClientCreate, ClientRead
from app.crud.client_crud import get_clients, create_client
from app.api.deps import get_current_user

router = APIRouter(prefix="/clients", tags=["clients"])

@router.get("/", response_model=List[ClientRead], dependencies=[Depends(get_current_user)])
async def list_clients(skip: int = 0, limit: int = 100):
    return get_clients(skip, limit)

@router.post("/", response_model=ClientRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_user)])
async def add_client(client: ClientCreate):
    return create_client(client)