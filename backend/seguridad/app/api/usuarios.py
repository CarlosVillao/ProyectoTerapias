from fastapi import APIRouter, HTTPException
from app.database import get_connection

router = APIRouter()

# Endpoint de prueba
@router.get("/usuarios/ping")
def ping_db():
    try:
        conn = get_connection()
        conn.close()
        return {"mensaje": "✅ Conexión exitosa a la base de datos"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Prueba inicial al cargar el archivo (opcional)
try:
    conn = get_connection()
    print("✅ Conexión exitosa (prueba inicial)")
    conn.close()
except Exception as e:
    print(f"❌ Error (prueba inicial): {str(e).encode('utf-8', errors='replace').decode('utf-8')}")

