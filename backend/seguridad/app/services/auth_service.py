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
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        print("✅ Usuario encontrado. Verificando contraseña...")
        if not verify_password(password, user['user_password']):
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

        if not user['user_state']:
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
            raise HTTPException(status_code=403, detail="El usuario no tiene roles asignados")

        return {
            "user": dict(user),
            "roles": [dict(rol) for rol in roles]
        }

    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"❌ Error en login_user: {str(e)}")
        raise HTTPException(status_code=500, detail="Error en autenticación")

    finally:
        if conn:
            conn.close()


def seleccionar_rol_activo(user_id: int, rol_id: int, origin_ip: str, host_name: str):
    conn = get_connection()
    cur = conn.cursor()

    try:
        cur.execute("""
            INSERT INTO ceragen.segu_login (
                slo_user_id, slo_token, slo_origin_ip, slo_host_name, slo_date_start_connection
            ) VALUES (%s, '', %s, %s, now()) RETURNING slo_id
        """, (user_id, origin_ip, host_name))
        row = cur.fetchone()
        login_id = row[0] if row else None

        token = create_access_token({"user_id": user_id, "rol_id": rol_id, "login_id": login_id})

        cur.execute("UPDATE ceragen.segu_login SET slo_token = %s WHERE slo_id = %s", (token, login_id))
        conn.commit()

        return token, login_id

    except Exception as e:
        print(f"❌ Error en seleccionar_rol_activo: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al seleccionar rol")

    finally:
        conn.close()


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

    except Exception as e:
        print(f"❌ Error al cambiar contraseña: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al cambiar contraseña")

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

        token = str(random.randint(100000, 999999))
        cur.execute("""
            INSERT INTO ceragen.segu_user_notification (
                sun_user_destination_id, sun_user_source_id, sun_title_notification, sun_text_notification, sun_state_notification, sun_date_notification, sun_isread_notification
            ) VALUES (%s, %s, 'Recuperación de contraseña', %s, true, now(), false)
        """, (user["user_id"], user["user_id"], token))

        conn.commit()
        return {"message": f"Código de recuperación generado: {token} (modo prueba)"}

    except Exception as e:
        print(f"❌ Error al generar código de recuperación: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al generar código de recuperación")

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

        cur.execute("""
            SELECT sun_id FROM ceragen.segu_user_notification
            WHERE sun_user_destination_id = %s AND sun_text_notification = %s AND sun_state_notification = true
            ORDER BY sun_date_notification DESC LIMIT 1
        """, (user["user_id"], token))
        valid = cur.fetchone()

        if not valid:
            raise HTTPException(status_code=400, detail="Token inválido o expirado")

        new_hash = hash_password(new_password)
        cur.execute("UPDATE ceragen.segu_user SET user_password = %s WHERE user_id = %s", (new_hash, user["user_id"]))

        cur.execute("UPDATE ceragen.segu_user_notification SET sun_state_notification = false WHERE sun_id = %s", (valid["sun_id"],))
        conn.commit()

        return {"message": "Contraseña restablecida correctamente"}

    except Exception as e:
        print(f"❌ Error al resetear contraseña: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al resetear contraseña")

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

        cur.execute("SELECT rol_name FROM ceragen.segu_rol WHERE rol_id = %s", (new_rol_id,))
        rol_row = cur.fetchone()
        rol_name = rol_row["rol_name"] if rol_row else "Rol desconocido"

        cur.execute("""
            SELECT m.menu_id, m.menu_name, m.menu_url, m.menu_icon_name
            FROM ceragen.segu_menu m
            JOIN ceragen.segu_menu_rol mr ON m.menu_id = mr.mr_menu_id
            WHERE mr.mr_rol_id = %s AND m.menu_state = true
            ORDER BY m.menu_order;
        """, (new_rol_id,))
        menus = cur.fetchall()

        conn.commit()

        return {
            "token": new_token,
            "rol_id": new_rol_id,
            "rol_name": rol_name,
            "menus": [dict(m) for m in menus],
            "message": "Rol activo cambiado correctamente"
        }

    except Exception as e:
        print(f"❌ Error en cambiar_rol_activo: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al cambiar rol activo")

    finally:
        conn.close()
