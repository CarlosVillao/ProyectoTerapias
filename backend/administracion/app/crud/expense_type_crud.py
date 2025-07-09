from app.db.database import get_connection
from app.schemas.expense_type_schema import ExpenseTypeCreate
from datetime import datetime

def get_expense_types(skip: int = 0, limit: int = 100) -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              ext_id, ext_name, ext_description,
              user_created, date_created
            FROM ceragen.admin_expense_type
            ORDER BY ext_id
            OFFSET %s LIMIT %s;
            """,
            (skip, limit)
        )
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()

def create_expense_type(data: ExpenseTypeCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.admin_expense_type
              (ext_name, ext_description, user_created, date_created)
            VALUES (%s, %s, %s, %s)
            RETURNING
              ext_id, ext_name, ext_description,
              user_created, date_created;
            """,
            (
                data.ext_name,
                data.ext_description,
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
