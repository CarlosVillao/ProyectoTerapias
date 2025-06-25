# app/services/user_service.py
from app.db.connection import get_connection
from app.utils.password_handler import hash_password
from fastapi import HTTPException
from datetime import datetime

import psycopg2.extras

def crear_usuario(data):
    conn = get_connection()
    cur = conn.cursor()

    try:
        # Validar si el correo ya existe
        cur.execute("SELECT 1 FROM ceragen.segu_user WHERE user_mail = %s", (data.email,))
        if cur.fetchone():
            raise HTTPException(status_code=400, detail="El correo ya está registrado.")

        # Validar si el person_id existe
        cur.execute("SELECT 1 FROM ceragen.admin_person WHERE per_id = %s AND date_deleted IS NULL", (data.person_id,))
        if not cur.fetchone():
            raise HTTPException(status_code=400, detail="El ID de persona no existe o fue eliminado.")

        hashed_password = hash_password(data.password)

        # Insertar en segu_user
        cur.execute("""
            INSERT INTO ceragen.segu_user (
                user_person_id,
                user_login_id,
                user_mail,
                user_password,
                user_state,
                user_locked,
                user_created,
                date_created
            ) VALUES (%s, %s, %s, %s, %s, false, %s, now())
            RETURNING user_id
        """, (
            data.person_id,
            data.login_id,
            data.email,
            hashed_password,
            data.state,
            'admin'  # esto luego será el usuario autenticado
        ))

        user_id = cur.fetchone()[0]

        # Asignar roles
        for rol_id in data.roles:
         cur.execute("""
          INSERT INTO ceragen.segu_user_rol (
            id_user, id_rol, user_created, date_created
          ) VALUES (%s, %s, %s, %s)
          """, (
        user_id,
        rol_id,
        'admin',                 # luego será el usuario autenticado
        datetime.now()
        ))

        conn.commit()

        return {"message": "Usuario creado correctamente", "user_id": user_id}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear usuario: {str(e)}")

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
