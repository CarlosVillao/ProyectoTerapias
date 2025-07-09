# app/api/routers/invoice_details.py

from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.invoice_detail_schema import InvoiceDetailCreate, InvoiceDetailRead
from app.crud.invoice_detail_crud import get_invoice_details, create_invoice_detail
from app.crud.product_crud import get_product
from app.crud.invoice_crud import get_invoice
from app.api.deps import get_current_user

router = APIRouter(prefix="/invoice-details", tags=["invoice-details"])

@router.get(
    "/",
    response_model=List[InvoiceDetailRead],
    dependencies=[Depends(get_current_user)]
)
def list_invoice_details(skip: int = 0, limit: int = 100):
    return get_invoice_details(skip, limit)

@router.post(
    "/",
    response_model=InvoiceDetailRead,
    status_code=status.HTTP_201_CREATED
)
def add_invoice_detail(
    ind: InvoiceDetailCreate,
    current_user: dict = Depends(get_current_user)
):
    # 1) Validar que la factura exista
    inv = get_invoice(ind.ind_invoice_id)
    if not inv:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Factura no existe"
        )
    # 2) Validar que el producto exista y esté activo
    prod = get_product(ind.ind_product_id)
    if not prod or not prod.get("pro_state", True):
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Producto no existe o está inactivo"
        )

    # 3) Rellenar auditoría y fecha
    ind.user_created = str(current_user["user"]["login_id"])
    ind.date_created = ind.date_created or datetime.utcnow()

    # 4) Crear detalle de factura
    return create_invoice_detail(ind)


#from typing import List
#from fastapi import APIRouter, Depends, status
#from app.schemas.invoice_detail_schema import InvoiceDetailCreate, InvoiceDetailRead
#from app.crud.invoice_detail_crud import get_invoice_details, create_invoice_detail
#from app.api.deps import get_current_user

#router = APIRouter(prefix="/invoice-details", tags=["invoice-details"])

#@router.get("/", response_model=List[InvoiceDetailRead], dependencies=[Depends(get_current_user)])
#def list_invoice_details(skip: int = 0, limit: int = 100):
#    return get_invoice_details(skip, limit)

#@router.post("/", response_model=InvoiceDetailRead, status_code=status.HTTP_201_CREATED,
#             dependencies=[Depends(get_current_user)])
#def add_invoice_detail(ind: InvoiceDetailCreate):
#    return create_invoice_detail(ind)
