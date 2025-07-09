from app.db.database import get_connection
from app.schemas.client_schema import ClientCreate
from datetime import datetime


def get_clients(skip: int = 0, limit: int = 100) -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT cli_id, cli_person_id, cli_identification, cli_name, cli_address_bill, cli_mail_bill, cli_state, user_created, date_created, user_modified, date_modified, user_deleted, date_deleted "
            "FROM ceragen.admin_client ORDER BY cli_id OFFSET %s LIMIT %s;",
            (skip, limit)
        )
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()


def create_client(data: ClientCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO ceragen.admin_client (cli_person_id, cli_identification, cli_name, cli_address_bill, cli_mail_bill, cli_state, user_created, date_created) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) "
            "RETURNING cli_id, cli_person_id, cli_identification, cli_name, cli_address_bill, cli_mail_bill, cli_state, user_created, date_created, user_modified, date_modified, user_deleted, date_deleted;",
            (
                data.cli_person_id,
                data.cli_identification,
                data.cli_name,
                data.cli_address_bill,
                data.cli_mail_bill,
                data.cli_state,
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

def get_client(cli_id: int) -> dict | None:
    """
    Recupera un cliente por su cli_id.
    Devuelve un dict con todos los campos o None si no existe.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              cli_id, cli_person_id, cli_identification, cli_name,
              cli_address_bill, cli_mail_bill, cli_state,
              user_created, date_created,
              user_modified, date_modified,
              user_deleted, date_deleted
            FROM ceragen.admin_client
            WHERE cli_id = %s;
            """,
            (cli_id,)
        )
        row = cur.fetchone()
        if not row:
            return None
        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row))
    finally:
        conn.close()