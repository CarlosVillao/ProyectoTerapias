# app/services/rol_service.py
from app.db.connection import get_connection
from fastapi import HTTPException
import psycopg2.extras

def crear_rol(data):
    conn = get_connection()
    cur = conn.cursor()

    try:
        # Validar duplicado
        cur.execute("SELECT 1 FROM ceragen.segu_rol WHERE rol_name = %s", (data.name,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="Nombre de rol ya existe")

        # Insertar rol
        cur.execute("""
            INSERT INTO ceragen.segu_rol (rol_name, rol_description, rol_state)
            VALUES (%s, %s, %s) RETURNING rol_id
        """, (data.name, data.description, data.state))
        rol_id = cur.fetchone()[0]

        # Insertar permisos (menús permitidos)
        for men_id in data.menus:
            cur.execute("""
                INSERT INTO ceragen.segu_menu_rol (merol_rol_id, merol_menu_id)
                VALUES (%s, %s)
            """, (rol_id, men_id))

        conn.commit()
        return {"message": "Rol creado exitosamente", "rol_id": rol_id}

    finally:
        conn.close()

def listar_roles():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("""
        SELECT r.rol_id, r.rol_name, r.rol_description, r.rol_state,
               ARRAY_AGG(m.men_name) as menus
        FROM ceragen.segu_rol r
        LEFT JOIN ceragen.segu_menu_rol mr ON r.rol_id = mr.merol_rol_id
        LEFT JOIN ceragen.segu_menu m ON mr.merol_menu_id = m.men_id
        GROUP BY r.rol_id
    """)
    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]
