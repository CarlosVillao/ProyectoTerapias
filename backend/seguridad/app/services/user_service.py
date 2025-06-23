# app/services/user_service.py
from app.db.connection import get_connection
from app.utils.password_handler import hash_password
from fastapi import HTTPException
import psycopg2.extras

def crear_usuario(data):
    conn = get_connection()
    cur = conn.cursor()

    try:
        # Validar si el email ya existe
        cur.execute("SELECT 1 FROM ceragen.segu_user WHERE usu_email = %s", (data.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="El correo ya está registrado.")

        hashed = hash_password(data.password)

        # Insertar usuario
        cur.execute("""
            INSERT INTO ceragen.segu_user (usu_email, usu_password, usu_state, usu_date_create, usu_user_create)
            VALUES (%s, %s, %s, now(), 'admin') RETURNING usu_id
        """, (data.email, hashed, data.state))
        user_id = cur.fetchone()[0]

        # Insertar roles asociados
        for rol_id in data.roles:
            cur.execute("""
                INSERT INTO ceragen.segu_user_rol (usro_user_id, usro_rol_id)
                VALUES (%s, %s)
            """, (user_id, rol_id))

        conn.commit()
        return {"message": "Usuario creado correctamente", "user_id": user_id}

    finally:
        conn.close()

def listar_usuarios():
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    cur.execute("""
        SELECT u.usu_id, u.usu_email, u.usu_state, 
               ARRAY_AGG(r.rol_name) as roles
        FROM ceragen.segu_user u
        LEFT JOIN ceragen.segu_user_rol ur ON u.usu_id = ur.usro_user_id
        LEFT JOIN ceragen.segu_rol r ON ur.usro_rol_id = r.rol_id
        GROUP BY u.usu_id
    """)
    rows = cur.fetchall()
    conn.close()

    return [dict(row) for row in rows]
