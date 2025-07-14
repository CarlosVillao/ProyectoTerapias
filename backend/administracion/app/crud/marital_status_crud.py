from app.db.database import get_connection

def get_all_marital_statuses() -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT
              id AS mst_id,
              status_name AS mst_name,
              state,
              user_created,
              date_created,
              user_modified,
              date_modified,
              user_deleted,
              date_deleted
            FROM ceragen.admin_marital_status
            ORDER BY id;
        """)
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()

def get_marital_status(ms_id: int) -> dict | None:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT
              id AS mst_id,
              status_name AS mst_name,
              state,
              user_created,
              date_created,
              user_modified,
              date_modified,
              user_deleted,
              date_deleted
            FROM ceragen.admin_marital_status
            WHERE id = %s;
        """, (ms_id,))
        row = cur.fetchone()
        if not row:
            return None
        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row))
    finally:
        conn.close()
