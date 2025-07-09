# app/services/menu_service.py

from app.db.connection import get_connection
import psycopg2.extras

def listar_menus_por_rol(rol_id: int):
    """
    Retorna la lista de menús activos asignados al rol especificado.
    """
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("""
            SELECT 
                m.menu_id,
                m.menu_name,
                m.menu_icon_name,
                m.menu_url,
                m.menu_order
            FROM ceragen.segu_menu m
            INNER JOIN ceragen.segu_menu_rol mr ON m.menu_id = mr.mr_menu_id
            WHERE mr.mr_rol_id = %s AND m.menu_state = TRUE
            ORDER BY m.menu_order
        """, (rol_id,))
        
        rows = cur.fetchall()
        menus = [dict(row) for row in rows]
        print(f"✅ {len(menus)} menús encontrados para el rol {rol_id}")
        return menus

    except Exception as e:
        print(f"❌ Error al listar menús por rol ({rol_id}): {e}")
        return []

    finally:
        conn.close()
