# app/services/menu_service.py
from app.db.connection import get_connection
import psycopg2.extras

def listar_menus_por_rol(rol_id: int):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("""
        SELECT m.men_id as id, m.men_name as name, m.men_icon as icon, m.men_route as route, m.men_order as order
        FROM ceragen.segu_menu m
        JOIN ceragen.segu_menu_rol mr ON m.men_id = mr.merol_menu_id
        WHERE mr.merol_rol_id = %s AND m.men_state = true
        ORDER BY m.men_order
    """, (rol_id,))
    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]
