# app/api/routers/invoices.py

from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.invoice_schema import InvoiceCreate, InvoiceRead
from app.crud.invoice_crud import get_invoices, create_invoice
from app.crud.patient_crud import get_patient
from app.crud.client_crud import get_client
from app.api.deps import get_current_user

router = APIRouter(prefix="/invoices", tags=["invoices"])

@router.get(
    "/",
    response_model=List[InvoiceRead],
    dependencies=[Depends(get_current_user)]
)
def list_invoices(skip: int = 0, limit: int = 100):
    return get_invoices(skip, limit)

@router.post(
    "/",
    response_model=InvoiceRead,
    status_code=status.HTTP_201_CREATED
)
def add_invoice(
    inv: InvoiceCreate,
    current_user: dict = Depends(get_current_user)
):
    # 1) Validar cliente
    client = get_client(inv.inv_client_id)
    if not client or not client.get("cli_state", True):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Cliente no existe o está inactivo"
        )
    # 2) Validar paciente
    patient = get_patient(inv.inv_patient_id)
    if not patient or not patient.get("pat_state", True):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Paciente no existe o está inactivo"
        )

    # 3) Completar auditoría y fecha de factura
    inv.user_created  = str(current_user["user"]["login_id"])
    inv.date_created  = inv.date_created or datetime.utcnow()
    inv.inv_date      = inv.inv_date or datetime.utcnow()

    # 4) Crear factura
    return create_invoice(inv)




#from typing import List
#from fastapi import APIRouter, Depends, status
#from app.schemas.invoice_schema import InvoiceCreate, InvoiceRead
#from app.crud.invoice_crud import get_invoices, create_invoice
#from app.api.deps import get_current_user

#router = APIRouter(prefix="/invoices", tags=["invoices"])

#@router.get("/", response_model=List[InvoiceRead], dependencies=[Depends(get_current_user)])
#def list_invoices(skip: int = 0, limit: int = 100):
#    return get_invoices(skip, limit)

#@router.post("/", response_model=InvoiceRead, status_code=status.HTTP_201_CREATED,
#             dependencies=[Depends(get_current_user)])
#def add_invoice(inv: InvoiceCreate):
#    return create_invoice(inv)
