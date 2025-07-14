from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:desarrollo123@localhost:5432/ws_ceragen"
    pacientes_service_url: str = "http://localhost:8001"
    security_service_url: str = "http://localhost:8002"
    jwt_secret: str = "clave_super_segura"
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()


