from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas.invoice_payment_schema import InvoicePaymentCreate, InvoicePaymentRead
from app.crud.invoice_payment_crud import get_invoice_payments, create_invoice_payment
from app.api.deps import get_current_user

router = APIRouter(prefix="/invoice-payments", tags=["invoice-payments"])

@router.get("/", response_model=List[InvoicePaymentRead], dependencies=[Depends(get_current_user)])
def list_invoice_payments(skip: int = 0, limit: int = 100):
    return get_invoice_payments(skip, limit)

@router.post("/", response_model=InvoicePaymentRead, status_code=status.HTTP_201_CREATED,
             dependencies=[Depends(get_current_user)])
def add_invoice_payment(inp: InvoicePaymentCreate):
    return create_invoice_payment(inp)
