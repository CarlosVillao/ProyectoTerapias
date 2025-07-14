from app.db.database import get_connection

def get_all_genres() -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT
              id AS gen_id,
              genre_name AS gen_name,
              state,
              user_created,
              date_created,
              user_modified,
              date_modified,
              user_deleted,
              date_deleted
            FROM ceragen.admin_person_genre
            ORDER BY id;
        """)
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()

def update_genre(genre_id: int, data: dict) -> dict | None:
    conn = get_connection()
    try:
        cur = conn.cursor()
        set_clause = ', '.join([f"{k} = %s" for k in data.keys()])
        values = list(data.values()) + [genre_id]
        cur.execute(f"""
            UPDATE ceragen.admin_person_genre SET {set_clause} WHERE id = %s RETURNING id;
        """, values)
        updated = cur.fetchone()
        conn.commit()
        return {'gen_id': updated[0]} if updated else None
    finally:
        conn.close()

def delete_genre(genre_id: int) -> bool:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("DELETE FROM ceragen.admin_person_genre WHERE id = %s;", (genre_id,))
        conn.commit()
        return cur.rowcount > 0
    finally:
        conn.close()
def get_genre(genre_id: int) -> dict | None:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT
              id AS gen_id,
              genre_name AS gen_name,
              state,
              user_created,
              date_created,
              user_modified,
              date_modified,
              user_deleted,
              date_deleted
            FROM ceragen.admin_person_genre
            WHERE id = %s;
        """, (genre_id,))
        row = cur.fetchone()
        if not row:
            return None
        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row))
    finally:
        conn.close()
