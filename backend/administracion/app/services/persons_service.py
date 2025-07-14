from app.crud.person_crud import get_persons, create_person, get_person
from app.schemas.person_schema import PersonCreate

def list_persons_service(skip: int = 0, limit: int = 100):
    return get_persons(skip, limit)

def create_person_service(data: PersonCreate):
    return create_person(data)

def get_person_service(per_id: int):
    return get_person(per_id)
