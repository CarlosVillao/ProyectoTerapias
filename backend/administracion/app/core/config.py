# administracion/app/core/config.py

from pydantic_settings import BaseSettings
from pydantic import AnyUrl

class Settings(BaseSettings):
    database_url: str #AnyUrl
    pacientes_service_url: str
    security_service_url: str 

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
