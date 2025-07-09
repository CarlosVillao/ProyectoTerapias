from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.payment_method_schema import PaymentMethodCreate, PaymentMethodRead
from app.crud.payment_method_crud import get_payment_methods, create_payment_method
from app.api.deps import get_current_user

router = APIRouter(prefix="/payment-methods", tags=["payment-methods"])

@router.get("/", response_model=List[PaymentMethodRead], dependencies=[Depends(get_current_user)])
def list_payment_methods(skip: int = 0, limit: int = 100):
    return get_payment_methods(skip, limit)

@router.post("/", response_model=PaymentMethodRead, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(get_current_user)])
def add_payment_method(pm: PaymentMethodCreate):
    return create_payment_method(pm)
