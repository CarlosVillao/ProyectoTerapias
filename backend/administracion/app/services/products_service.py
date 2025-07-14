from app.crud.product_crud import get_products, create_product, get_product
from app.schemas.product_schema import ProductCreate

def list_products_service(skip: int = 0, limit: int = 100):
    return get_products(skip, limit)

def create_product_service(data: ProductCreate):
    return create_product(data)

def get_product_service(prod_id: int):
    return get_product(prod_id)
