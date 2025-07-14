import os
from dotenv import load_dotenv

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "ceragen")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
SECRET_KEY = os.getenv("SECRET_KEY")  # Debe estar definido en el .env y ser igual en todos los microservicios
ALGORITHM = os.getenv("ALGORITHM", "HS256")
