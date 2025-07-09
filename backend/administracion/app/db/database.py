# administracion/app/db/database.py

from urllib.parse import urlparse
import pg8000
from app.core.config import settings

def get_connection():
    # Imprime la URL tal cual la lee Pydantic
    print(">>> SETTINGS.database_url:", settings.database_url)

    parsed = urlparse(settings.database_url)
    print(">>> parsed.username:", parsed.username)
    print(">>> parsed.password:", parsed.password)

    conn = pg8000.connect(
        user=parsed.username,
        password=parsed.password,
        host=parsed.hostname,
        port=parsed.port,
        database=parsed.path.lstrip("/")
    )
    return conn
