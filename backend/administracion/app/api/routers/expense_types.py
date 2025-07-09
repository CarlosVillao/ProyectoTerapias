from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.expense_type_schema import ExpenseTypeCreate, ExpenseTypeRead
from app.crud.expense_type_crud import get_expense_types, create_expense_type
from app.api.deps import get_current_user

router = APIRouter(prefix="/expense-types", tags=["expense-types"])

@router.get("/", response_model=List[ExpenseTypeRead], dependencies=[Depends(get_current_user)])
def list_expense_types(skip: int = 0, limit: int = 100):
    return get_expense_types(skip, limit)

@router.post("/", response_model=ExpenseTypeRead, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(get_current_user)])
def add_expense_type(et: ExpenseTypeCreate):
    return create_expense_type(et)
