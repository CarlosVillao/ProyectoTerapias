# app/services/auth_service.py
from fastapi import HTTPException
from app.db.connection import get_connection
from app.utils.password_handler import verify_password, hash_password
from app.utils.jwt_handler import create_access_token

import random
import psycopg2.extras

def login_user(email: str, password: str):
    try:
        conn = get_connection()
        cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        print("🔍 Buscando usuario con email:", email)
        cur.execute("SELECT * FROM ceragen.segu_user WHERE user_mail = %s", (email,))
        user = cur.fetchone()

        if not user:
            print("❌ Usuario no encontrado con ese correo.")
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        print("✅ Usuario encontrado. Verificando contraseña...")
        print(" Password recibido:",password)
        print("Password de la base:",user['user_password'])

        # Temporalmente, puedes descomentar la línea de abajo para comparar sin hash
        if not verify_password(password, user['user_password']):
            print("❌ Contraseña incorrecta.")
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        if not user['user_state']:
            print("⚠️ Usuario está inactivo o bloqueado.")
            raise HTTPException(status_code=403, detail="Usuario inactivo o bloqueado")

        print("✅ Usuario activo. Consultando roles...")

        cur.execute("""
            SELECT r.rol_id, r.rol_name
            FROM ceragen.segu_rol r
            JOIN ceragen.segu_user_rol ur ON r.rol_id = ur.id_rol
            WHERE ur.id_user = %s
        """, (user['user_id'],))
        roles = cur.fetchall()

        if not roles:
            print("⚠️ Usuario sin roles asignados.")
            raise HTTPException(status_code=403, detail="El usuario no tiene roles asignados")

        print("✅ Roles encontrados. Login exitoso.")
        return {
            "user": dict(user),
            "roles": [dict(rol) for rol in roles]
        }

    except Exception as e:
        print(f"❌ Error en login_user: {str(e)}")
        raise HTTPException(status_code=500, detail="Error en autenticación")
    finally:
        if conn:
            conn.close()


#def seleccionar_rol_activo(user_id: int, rol_id: int, origin_ip: str, host_name: str):
    #conn = get_connection()
    #cur = conn.cursor()

    #cur.execute("""
    #    INSERT INTO ceragen.segu_login (
    #        slo_user_id, slo_token, slo_origin_ip, slo_host_name, slo_date_start_connection
    #    ) VALUES (%s, '', %s, %s, now()) RETURNING slo_id
    #""", (user_id, origin_ip, host_name))
    #login_id = cur.fetchone()[0]

    #token = create_access_token({"user_id": user_id, "rol_id": rol_id, "login_id": login_id})

    #cur.execute("UPDATE ceragen.segu_login SET slo_token = %s WHERE slo_id = %s", (token, login_id))
    #conn.commit()
    #conn.close()

    #return token

def seleccionar_rol_activo(user_id: int, rol_id: int, origin_ip: str, host_name: str):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO ceragen.segu_login (
            slo_user_id, slo_token, slo_origin_ip, slo_host_name, slo_date_start_connection
        ) VALUES (%s, '', %s, %s, now()) RETURNING slo_id
    """, (user_id, origin_ip, host_name))
    login_id = cur.fetchone()[0]

    # Generar token
    token = create_access_token({"user_id": user_id, "rol_id": rol_id, "login_id": login_id})

    # Actualizar token
    cur.execute("UPDATE ceragen.segu_login SET slo_token = %s WHERE slo_id = %s", (token, login_id))
    conn.commit()
    conn.close()

    # 🚨 Devolver también el login_id
    return token, login_id



def cambiar_contrasena(user_id: int, old_password: str, new_password: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("SELECT user_password FROM ceragen.segu_user WHERE user_id = %s", (user_id,))
        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        if not verify_password(old_password, user['user_password']):
            raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")

        new_hash = hash_password(new_password)
        cur.execute("UPDATE ceragen.segu_user SET user_password = %s WHERE user_id = %s", (new_hash, user_id))
        conn.commit()

        return {"message": "Contraseña actualizada correctamente"}

    finally:
        conn.close()


def enviar_codigo_recuperacion(email: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("SELECT user_id FROM ceragen.segu_user WHERE user_mail = %s", (email,))
        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user["user_id"]
        token = str(random.randint(100000, 999999))

        cur.execute("""
            INSERT INTO ceragen.segu_user_notification (
                usno_user_id, usno_type, usno_message, usno_state, usno_created_at
            ) VALUES (%s, 'RECUPERACION', %s, true, now())
        """, (user_id, token))

        conn.commit()
        return {"message": f"Código de recuperación generado: {token} (solo pruebas)"}

    finally:
        conn.close()


def resetear_contrasena(email: str, token: str, new_password: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("SELECT user_id FROM ceragen.segu_user WHERE user_mail = %s", (email,))
        user = cur.fetchone()

        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        user_id = user["user_id"]

        cur.execute("""
            SELECT usno_id FROM ceragen.segu_user_notification
            WHERE usno_user_id = %s AND usno_type = 'RECUPERACION' AND usno_message = %s
              AND usno_state = true
            ORDER BY usno_created_at DESC LIMIT 1
        """, (user_id, token))
        valid = cur.fetchone()

        if not valid:
            raise HTTPException(status_code=400, detail="Token inválido o expirado")

        new_hash = hash_password(new_password)
        cur.execute("UPDATE ceragen.segu_user SET user_password = %s WHERE user_id = %s", (new_hash, user_id))

        cur.execute("UPDATE ceragen.segu_user_notification SET usno_state = false WHERE usno_id = %s", (valid["usno_id"],))
        conn.commit()

        return {"message": "Contraseña restablecida correctamente"}

    finally:
        conn.close()


def cambiar_rol_activo(login_id: int, user_id: int, new_rol_id: int, ip: str, host: str):
    conn = get_connection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        cur.execute("""
            SELECT 1 FROM ceragen.segu_user_rol 
            WHERE id_user = %s AND id_rol = %s
        """, (user_id, new_rol_id))
        if not cur.fetchone():
            raise HTTPException(status_code=403, detail="Rol no asignado al usuario")

        new_token = create_access_token({
            "user_id": user_id,
            "rol_id": new_rol_id,
            "login_id": login_id
        })

        cur.execute("""
            UPDATE ceragen.segu_login
            SET slo_token = %s, slo_origin_ip = %s, slo_host_name = %s, slo_date_start_connection = now()
            WHERE slo_id = %s
        """, (new_token, ip, host, login_id))

        conn.commit()
        return {
            "token": new_token,
            "message": "Rol activo cambiado correctamente"
        }

    finally:
        conn.close()
