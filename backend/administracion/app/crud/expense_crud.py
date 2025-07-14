from app.db.database import get_connection
from app.schemas.expense_schema import ExpenseCreate
from datetime import datetime

def get_expenses(skip: int = 0, limit: int = 100) -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              exp_id, exp_type_id, exp_payment_method_id,
              exp_date, exp_amount, exp_description,
              user_created, date_created
            FROM ceragen.admin_expense
            ORDER BY exp_id
            OFFSET %s LIMIT %s;
            """,
            (skip, limit)
        )
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()

def get_expense(exp_id: int) -> dict | None:
    """
    Recupera un gasto por su exp_id.
    Devuelve un dict con todos los campos o None si no existe.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              exp_id, exp_type_id, exp_payment_method_id,
              exp_date, exp_amount, exp_description,
              user_created, date_created
            FROM ceragen.admin_expense
            WHERE exp_id = %s;
            """,
            (exp_id,)
        )
        row = cur.fetchone()
        if not row:
            return None
        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row))
    finally:
        conn.close()

def create_expense(data: ExpenseCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.admin_expense
              (exp_type_id, exp_payment_method_id,
               exp_date, exp_amount, exp_description,
               user_created, date_created)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING
              exp_id, exp_type_id, exp_payment_method_id,
              exp_date, exp_amount, exp_description,
              user_created, date_created;
            """,
            (
                data.exp_type_id,
                data.exp_payment_method_id,
                data.exp_date or datetime.utcnow().date(),
                data.exp_amount,
                data.exp_description,
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
