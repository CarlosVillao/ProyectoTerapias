# app/main.py
from fastapi import FastAPI
from app.routes import auth_routes, user_routes, rol_routes, menu_routes, module_routes

app = FastAPI(
    title="Microservicio de Seguridad",
    version="1.0.0"
)

# Rutas por funcionalidad
app.include_router(auth_routes.router, prefix="/auth", tags=["Autenticación"])
app.include_router(user_routes.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(rol_routes.router, prefix="/roles", tags=["Roles"])
app.include_router(menu_routes.router, prefix="/menus", tags=["Menús"])
app.include_router(module_routes.router, prefix="/modulos", tags=["Módulos"])

# Ruta raíz para verificación rápida
@app.get("/")
def root():
    return {"message": "Microservicio de Seguridad activo"}
