from app.db.database import get_connection
from app.schemas.invoice_payment_schema import InvoicePaymentCreate
from datetime import datetime

def get_invoice_payments(skip: int = 0, limit: int = 100) -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              inp_id, inp_invoice_id, inp_payment_method_id,
              inp_amount, inp_reference,
              user_created, date_created
            FROM ceragen.admin_invoice_payment
            ORDER BY inp_id
            OFFSET %s LIMIT %s;
            """,
            (skip, limit)
        )
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()

def create_invoice_payment(data: InvoicePaymentCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.admin_invoice_payment
              (inp_invoice_id, inp_payment_method_id,
               inp_amount, inp_reference,
               user_created, date_created)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING
              inp_id, inp_invoice_id, inp_payment_method_id,
              inp_amount, inp_reference,
              user_created, date_created;
            """,
            (
                data.inp_invoice_id,
                data.inp_payment_method_id,
                data.inp_amount,
                data.inp_reference,
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
