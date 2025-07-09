# administracion/app/main.py
# administracion/app/main.py

from fastapi import FastAPI, Depends, HTTPException
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




#from fastapi import FastAPI, Depends, HTTPException
#from psycopg2 import OperationalError

#from app.db.database import get_connection
#from app.api.deps import get_current_user

# Importa tu router de clients (y después los demás)
##from app.api.routers import clients  

#from app.api.routers.clients import router as clients_router
#from app.api.routers.persons import router as persons_router
#from app.api.routers.genres import router as genres_router
#from app.api.routers.marital_status import router as ms_router
#from app.api.routers.payment_methods import router as pm_router
#from app.api.routers.invoices import router as invoice_router
#from app.api.routers.invoice_details import router as ind_router
#from app.api.routers.invoice_payments import router as inp_router
#from app.api.routers.expense_types import router as et_router
#from app.api.routers.expenses import router as exp_router

#app = FastAPI(
#    title="Microservicio Administración",
#    version="0.1.0",
#    docs_url="/docs",
#    redoc_url="/redoc"
#)

#@app.get("/", dependencies=[Depends(get_current_user)])
#async def root():
#    """
#    Endpoint de health-check que valida:
#      - Token JWT válido
#      - Conexión a la BD
#    """
#    try:
#        conn = get_connection()
#        with conn.cursor() as cur:
#            cur.execute("SELECT 1;")
#        conn.close()
#        return {"message": "Admin Service OK", "db": "connected"}
#    except OperationalError as e:
#        raise HTTPException(status_code=500, detail=f"DB connection error: {e}")
#    except Exception as e:
#        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")

# Monta el router con validación JWT
##app.include_router(
##    clients.router,
##    prefix="/clients",
##    tags=["clients"]
##)

#app.include_router(clients_router)
#app.include_router(persons_router)
#app.include_router(genres_router)
#app.include_router(ms_router)
#app.include_router(pm_router)
#app.include_router(invoice_router)
#app.include_router(ind_router)
#app.include_router(inp_router)
#app.include_router(et_router)
#app.include_router(exp_router)