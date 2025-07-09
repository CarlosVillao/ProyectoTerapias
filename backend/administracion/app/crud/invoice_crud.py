from app.db.database import get_connection
from app.schemas.invoice_schema import InvoiceCreate
from datetime import datetime

def get_invoices(skip: int = 0, limit: int = 100) -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              inv_id, inv_number, inv_date, inv_client_id, inv_patient_id,
              inv_subtotal, inv_discount, inv_tax, inv_grand_total,
              user_created, date_created
            FROM ceragen.admin_invoice
            ORDER BY inv_id
            OFFSET %s LIMIT %s;
            """,
            (skip, limit)
        )
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()

def get_invoice(inv_id: int) -> dict | None:
    """
    Recupera una factura por su inv_id.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              inv_id, inv_number, inv_date, inv_client_id, inv_patient_id,
              inv_subtotal, inv_discount, inv_tax, inv_grand_total,
              user_created, date_created
            FROM ceragen.admin_invoice
            WHERE inv_id = %s;
            """,
            (inv_id,)
        )
        row = cur.fetchone()
        if not row:
            return None
        cols = [d[0] for d in cur.description]
        return dict(zip(cols, row))
    finally:
        conn.close()

def create_invoice(data: InvoiceCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.admin_invoice
              (inv_number, inv_date, inv_client_id, inv_patient_id,
               inv_subtotal, inv_discount, inv_tax, user_created, date_created)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING
              inv_id, inv_number, inv_date, inv_client_id, inv_patient_id,
              inv_subtotal, inv_discount, inv_tax, inv_grand_total,
              user_created, date_created;
            """,
            (
                data.inv_number,
                data.inv_date or datetime.utcnow(),
                data.inv_client_id,
                data.inv_patient_id,
                data.inv_subtotal,
                data.inv_discount,
                data.inv_tax,
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
