# app/db/connection.py
import psycopg2
from app.config.settings import settings

def get_connection():
    try:
        conn = psycopg2.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            dbname=settings.DB_NAME,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD
        )
        return conn
    except Exception as e:
        print("Error al conectar a la base de datos:", str(e))
        raise
