from app.db.database import get_connection
from app.schemas.product_schema import ProductCreate
from datetime import datetime

def create_product(data: ProductCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.admin_product (
              pro_code, pro_name, pro_description, pro_price,
              pro_total_sessions, pro_duration_days, pro_image_url,
              pro_therapy_type_id, pro_state, user_created, date_created
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING
              pro_id, pro_code, pro_name, pro_description,
              pro_price, pro_total_sessions, pro_duration_days,
              pro_image_url, pro_therapy_type_id, pro_state,
              user_created, date_created,
              user_modified, date_modified, user_deleted, date_deleted;
            """,
            (
                data.pro_code,
                data.pro_name,
                data.pro_description,
                data.pro_price,
                data.pro_total_sessions,
                data.pro_duration_days,
                data.pro_image_url,
                data.pro_therapy_type_id,
                data.pro_state,
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


def get_product(pro_id: int) -> dict | None:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              pro_id, pro_code, pro_name, pro_description,
              pro_price, pro_total_sessions, pro_duration_days,
              pro_image_url, pro_therapy_type_id, pro_state,
              user_created, date_created,
              user_modified, date_modified, user_deleted, date_deleted
            FROM ceragen.admin_product
            WHERE pro_id = %s;
            """,
            (pro_id,)
        )
        row = cur.fetchone()
        if not row:
            return None
        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row))
    finally:
        conn.close()


def get_products(skip: int = 0, limit: int = 100) -> list[dict]:
    """
    Recupera una lista de productos, paginada.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              pro_id, pro_code, pro_name, pro_description,
              pro_price, pro_total_sessions, pro_duration_days,
              pro_image_url, pro_therapy_type_id, pro_state,
              user_created, date_created,
              user_modified, date_modified, user_deleted, date_deleted
            FROM ceragen.admin_product
            ORDER BY pro_id
            OFFSET %s LIMIT %s;
            """,
            (skip, limit)
        )
        rows = cur.fetchall()
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()