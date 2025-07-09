from app.db.database import get_connection
from app.schemas.person_schema import PersonCreate
from datetime import datetime


def create_person(data: PersonCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO ceragen.admin_person (per_identification, per_names, per_surnames, per_genre_id, per_marital_status_id, per_country, per_city, per_address, per_phone, per_mail, per_birth_date, per_state, user_created, date_created) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) "
            "RETURNING per_id, per_identification, per_names, per_surnames, per_genre_id, per_marital_status_id, per_country, per_city, per_address, per_phone, per_mail, per_birth_date, per_state, user_created, date_created, user_modified, date_modified, user_deleted, date_deleted;",
            (
                data.per_identification,
                data.per_names,
                data.per_surnames,
                data.per_genre_id,
                data.per_marital_status_id,
                data.per_country,
                data.per_city,
                data.per_address,
                data.per_phone,
                data.per_mail,
                data.per_birth_date,
                data.per_state,
                data.user_created,
                data.date_created or datetime.utcnow()
            )
        )
        row = cur.fetchone()
        cols = [desc[0] for desc in cur.description]
        conn.commit()
        return dict(zip(cols, row))
    finally:
        conn.close()

def get_person(per_id: int) -> dict | None:
    """
    Recupera una persona por su per_id.
    Devuelve un dict con todos los campos, o None si no existe.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              per_id, per_identification, per_names, per_surnames,
              per_genre_id, per_marital_status_id,
              per_country, per_city, per_address,
              per_phone, per_mail, per_birth_date,
              per_state, user_created, date_created,
              user_modified, date_modified,
              user_deleted, date_deleted
            FROM ceragen.admin_person
            WHERE per_id = %s;
            """,
            (per_id,)
        )
        row = cur.fetchone()
        if not row:
            return None
        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row))
    finally:
        conn.close()
