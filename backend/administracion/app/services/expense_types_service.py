from app.crud.expense_type_crud import get_expense_types, create_expense_type
from app.schemas.expense_type_schema import ExpenseTypeCreate

def list_expense_types_service(skip: int = 0, limit: int = 100):
    return get_expense_types(skip, limit)

def create_expense_type_service(data: ExpenseTypeCreate):
    return create_expense_type(data)
