from app.db.database import get_connection

def get_all_genres() -> list[dict]:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT 
              id AS id, genre_name, state,
              user_created, date_created,
              user_modified, date_modified,
              user_deleted, date_deleted
            FROM ceragen.admin_person_genre
            ORDER BY id;
        """)
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, r)) for r in rows]
    finally:
        conn.close()

def get_genre(genre_id: int) -> dict | None:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT 
              id AS id, genre_name, state,
              user_created, date_created,
              user_modified, date_modified,
              user_deleted, date_deleted
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
