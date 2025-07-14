from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.product_schema import ProductCreate, ProductRead
from app.services.products_service import (
    get_product_service,
    create_product_service,
    list_products_service
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=List[ProductRead], dependencies=[Depends(get_current_user)])
def list_products(skip: int = 0, limit: int = 100):
    return list_products_service(skip, limit)

@router.post(
    "/",
    response_model=ProductRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)]
)
def add_product(data: ProductCreate):
    # opcional: validar therapy_type antes de insertar…
    return create_product_service(data)
