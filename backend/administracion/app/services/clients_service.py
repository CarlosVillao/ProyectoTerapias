from app.crud.client_crud import get_clients, create_client, get_client
from app.schemas.client_schema import ClientCreate

def list_clients_service(skip: int = 0, limit: int = 100):
    return get_clients(skip, limit)

def create_client_service(data: ClientCreate):
    return create_client(data)

def get_client_service(cli_id: int):
    return get_client(cli_id)
