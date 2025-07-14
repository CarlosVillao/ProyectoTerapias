from app.crud.expense_crud import get_expenses, create_expense, get_expense
from app.schemas.expense_schema import ExpenseCreate

def list_expenses_service(skip: int = 0, limit: int = 100):
    return get_expenses(skip, limit)

def create_expense_service(data: ExpenseCreate):
    return create_expense(data)

def get_expense_service(exp_id: int):
    return get_expense(exp_id)
