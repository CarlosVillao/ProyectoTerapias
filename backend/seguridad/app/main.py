from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes, user_routes, rol_routes, menu_routes, module_routes

app = FastAPI(
    title="Microservicio de Seguridad",
    version="1.0.0"
)

# Orígenes permitidos para CORS (frontend)
origins = [
    "http://localhost:3000",
    # "http://tu-dominio.com",
    # agrega aquí otros dominios si los necesitas
]

# CORS Middleware (para permitir conexiones desde frontend u otras APIs)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,     # ← usar lista de orígenes concretos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de rutas por módulo
app.include_router(auth_routes.router, prefix="/auth", tags=["Autenticación"])
app.include_router(user_routes.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(rol_routes.router, prefix="/roles", tags=["Roles"])
app.include_router(menu_routes.router, prefix="/menus", tags=["Menús"])
app.include_router(module_routes.router, prefix="/modulos", tags=["Módulos"])

# Ruta raíz para verificación rápida
@app.get("/", tags=["Root"], summary="Estado del servicio")
def root():
    return {"message": "Microservicio de Seguridad activo", "version": app.version}
