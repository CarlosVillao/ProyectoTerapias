from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routers.patients import router as patients_router
from app.api.routers.sessions import router as sessions_router

app = FastAPI(
    title="Microservicio Pacientes",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://localhost:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(patients_router)
app.include_router(sessions_router)

# Bloque de ejecución directa
if __name__ == "__main__":
    import uvicorn
    print("🚀 Iniciando Microservicio de Pacientes...")
    print("📖 Documentación disponible en: http://localhost:8000/docs")
    print("🔍 ReDoc disponible en: http://localhost:8000/redoc")
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    )
