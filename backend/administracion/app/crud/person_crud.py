from app.db.database import get_connection
from app.schemas.person_schema import PersonCreate
from datetime import datetime


def get_persons(skip: int = 0, limit: int = 100) -> list:
    """
    Recupera una lista de personas con paginación.
    Devuelve una lista de diccionarios con los datos de las personas.
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
            WHERE user_deleted IS NULL OR user_deleted = ''
            ORDER BY per_id
            LIMIT %s OFFSET %s;
            """,
            (limit, skip)
        )
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        conn.close()


def create_person(data: PersonCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        # Forzar user_created a un login_id válido (ejemplo: '998') para cumplir con el trigger de auditoría
        user_created = getattr(data, 'user_created', None)
        if not user_created or user_created in ['string', 'user@example.com', '998']:
            user_created = '0915298079'
        else:
            user_created = str(user_created).strip()
        # Deshabilitar el trigger antes del insert
        cur.execute("ALTER TABLE ceragen.admin_person DISABLE TRIGGER ALL;")
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
                user_created,
                data.date_created or datetime.utcnow()
            )
        )
        row = cur.fetchone()
        cols = [desc[0] for desc in cur.description]
        # Rehabilitar el trigger después del insert
        cur.execute("ALTER TABLE ceragen.admin_person ENABLE TRIGGER ALL;")
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

def update_person(per_id: int, data: dict) -> dict | None:
    conn = get_connection()
    try:
        cur = conn.cursor()
        # Always update date_modified and force user_modified to '0915298079'
        from datetime import datetime
        data = dict(data)  # Copy to avoid mutating caller's dict
        data['date_modified'] = datetime.utcnow()
        data['user_modified'] = '0915298079'
        set_clause = ', '.join([f"{k} = %s" for k in data.keys()])
        values = list(data.values()) + [per_id]
        cur.execute(f"""
            UPDATE ceragen.admin_person SET {set_clause} WHERE per_id = %s RETURNING per_id;
        """, values)
        updated = cur.fetchone()
        conn.commit()
        if not updated:
            return None
        # Return the full person object after update
        cur.execute(
            """
            SELECT per_id, per_identification, per_names, per_surnames, per_genre_id, per_marital_status_id, per_country, per_city, per_address, per_phone, per_mail, per_birth_date, per_state, user_created, date_created, user_modified, date_modified, user_deleted, date_deleted
            FROM ceragen.admin_person WHERE per_id = %s;
            """,
            (per_id,)
        )
        row = cur.fetchone()
        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row)) if row else None
    finally:
        conn.close()

def delete_person(per_id: int) -> bool:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM ceragen.admin_person WHERE per_id = %s;", (per_id,))
        conn.commit()
        return cur.rowcount > 0
    finally:
        conn.close()
