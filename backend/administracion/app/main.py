# administracion/app/main.py
# administracion/app/main.py

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg2 import OperationalError

from datetime import datetime

from app.db.database import get_connection
from app.api.deps import get_current_user

from app.api.routers.clients import router as clients_router
from app.api.routers.persons import router as persons_router
from app.api.routers.patients import router as patients_router
from app.api.routers.products import router as products_router
from app.api.routers.genres import router as genres_router
from app.api.routers.marital_status import router as ms_router
from app.api.routers.payment_methods import router as pm_router
from app.api.routers.invoices import router as invoice_router
from app.api.routers.invoice_details import router as ind_router
from app.api.routers.invoice_payments import router as inp_router
from app.api.routers.expense_types import router as et_router
from app.api.routers.expenses import router as exp_router

app = FastAPI(
    title="Microservicio Administración",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

@app.get("/", dependencies=[Depends(get_current_user)])
async def root():
    """
    Health‐check endpoint: verifies JWT and database connectivity.
    """
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT 1;")
        conn.close()
        return {"message": "Admin Service OK", "db": "connected"}
    except OperationalError as e:
        raise HTTPException(status_code=500, detail=f"DB connection error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

# Include all routers
# Configuración de CORS para permitir peticiones desde frontend y tablets
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://localhost:5173",
    "http://localhost:5174",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Incluye todos los routers
app.include_router(clients_router)
app.include_router(persons_router)
app.include_router(patients_router)
app.include_router(products_router)
app.include_router(genres_router)
app.include_router(ms_router)
app.include_router(pm_router)
app.include_router(invoice_router)
app.include_router(ind_router)
app.include_router(inp_router)
app.include_router(et_router)
app.include_router(exp_router)

# Bloque de ejecución directa
if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando Microservicio de Administración...")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
