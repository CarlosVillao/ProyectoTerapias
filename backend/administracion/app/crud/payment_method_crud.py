from app.db.database import get_connection
from app.schemas.payment_method_schema import PaymentMethodCreate
from datetime import datetime

def get_payment_methods(skip: int = 0, limit: int = 100) -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              pme_id, pme_name, pme_require_references,
              user_created, date_created
            FROM ceragen.admin_payment_method
            ORDER BY pme_id
            OFFSET %s LIMIT %s;
            """,
            (skip, limit)
        )
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()

def create_payment_method(data: PaymentMethodCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.admin_payment_method
              (pme_name, pme_require_references, user_created, date_created)
            VALUES (%s, %s, %s, %s)
            RETURNING pme_id, pme_name, pme_require_references, user_created, date_created;
            """,
            (
                data.pme_name,
                data.pme_require_references,
                data.user_created,
                data.date_created or datetime.utcnow()
            )
        )
        row = cur.fetchone()
        cols = [d[0] for d in cur.description]
        conn.commit()
        return dict(zip(cols, row))
    finally:
        conn.close()
