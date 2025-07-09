from app.db.database import get_connection
from app.schemas.invoice_detail_schema import InvoiceDetailCreate
from datetime import datetime

def get_invoice_details(skip: int = 0, limit: int = 100) -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              ind_id, ind_invoice_id, ind_product_id,
              ind_quantity, ind_unit_price, ind_total,
              user_created, date_created
            FROM ceragen.admin_invoice_detail
            ORDER BY ind_id
            OFFSET %s LIMIT %s;
            """,
            (skip, limit)
        )
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()

def create_invoice_detail(data: InvoiceDetailCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.admin_invoice_detail
              (ind_invoice_id, ind_product_id, ind_quantity,
               ind_unit_price, ind_total, user_created, date_created)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING
              ind_id, ind_invoice_id, ind_product_id,
              ind_quantity, ind_unit_price, ind_total,
              user_created, date_created;
            """,
            (
                data.ind_invoice_id,
                data.ind_product_id,
                data.ind_quantity,
                data.ind_unit_price,
                data.ind_quantity * data.ind_unit_price,
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
