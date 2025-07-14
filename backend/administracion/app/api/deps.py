import httpx
import certifi
from fastapi import Header, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

security = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Token missing")
    token = credentials.credentials
    # Llamada al microservicio de Seguridad para validar el JWT
    print(">>> SECURITY_SERVICE_URL =", settings.security_service_url)

    # Forzamos el uso del CA bundle de certifi para evitar errores de SSL
    ssl_verify = certifi.where()
    async with httpx.AsyncClient(verify=ssl_verify) as client:
        base = str(settings.security_service_url).rstrip("/")
        url = f"{base}/auth/validate-token"
        resp = await client.post(
            url,
            json={"token": token}
        )
        print(">>> Calling:", url)
        try:
            response_data = resp.json()
        except ValueError:
            response_data = {"detail": "Invalid JSON response"}
        print(">>> Response:", resp.status_code, response_data)

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid token")   
    # Retorna datos del usuario proporcionados por el servicio de seguridad
    return response_data["user"]