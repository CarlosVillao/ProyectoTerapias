from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.expense_schema import ExpenseCreate, ExpenseRead
from app.crud.expense_crud import get_expenses, create_expense
from app.api.deps import get_current_user

router = APIRouter(prefix="/expenses", tags=["expenses"])

@router.get("/", response_model=List[ExpenseRead], dependencies=[Depends(get_current_user)])
def list_expenses(skip: int = 0, limit: int = 100):
    return get_expenses(skip, limit)

@router.post("/", response_model=ExpenseRead, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(get_current_user)])
def add_expense(e: ExpenseCreate):
    return create_expense(e)
