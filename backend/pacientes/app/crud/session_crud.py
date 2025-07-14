from app.db.database import get_connection
from app.schemas.session_schema import SessionCreate
from datetime import datetime
import psycopg2.extras

def get_sessions(skip: int = 0, limit: int = 100) -> list[dict]:
    """
    Recupera una lista de controles de sesiones con paginación.
    Devuelve una lista de diccionarios con los datos de las sesiones.
    """
    with get_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                '''
                SELECT * FROM ceragen.clinic_session_control
                WHERE date_deleted IS NULL
                ORDER BY sec_id
                LIMIT %s OFFSET %s
                ''',
                (limit, skip)
            )
            return cur.fetchall()

def create_session(data: SessionCreate) -> dict:
    """
    Crea un nuevo control de sesión.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.clinic_session_control (
                sec_inv_id, sec_pro_id, sec_ses_number,
                sec_ses_agend_date, sec_ses_exec_date, sec_typ_id,
                sec_med_staff_id, ses_consumed, ses_state,
                user_created, date_created
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING
                sec_id, sec_inv_id, sec_pro_id, sec_ses_number,
                sec_ses_agend_date, sec_ses_exec_date, sec_typ_id,
                sec_med_staff_id, ses_consumed, ses_state,
                user_created, date_created,
                user_modified, date_modified, user_deleted, date_deleted;
            """,
            (
                data.invoice_id,
                data.product_id,
                data.session_number,
                data.scheduled_date,
                data.execution_date,
                data.therapy_type_id,
                data.medical_staff_id,
                data.consumed,
                data.state,
                data.user_created,
                data.date_created or datetime.utcnow()
            )
        )
        row = cur.fetchone()
        cols = [desc[0] for desc in cur.description]
        conn.commit()
        return dict(zip(cols, row))
    finally:
        conn.close()

def get_session(id: int) -> dict | None:
    """
    Recupera un control de sesión por ID.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
                sec_id, sec_inv_id, sec_pro_id, sec_ses_number,
                sec_ses_agend_date, sec_ses_exec_date, sec_typ_id,
                sec_med_staff_id, ses_consumed, ses_state,
                user_created, date_created, user_modified, date_modified,
                user_deleted, date_deleted
            FROM ceragen.clinic_session_control
            WHERE sec_id = %s AND (ses_deleted IS NULL OR ses_deleted = false);
            """,
            (id,)
        )
        row = cur.fetchone()
        if not row:
            return None
        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row))
    finally:
        conn.close()

def get_sessions_by_patient(patient_id: int) -> list[dict]:
    """
    Recupera todas las sesiones de un paciente específico.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
                sec.sec_id, sec.sec_inv_id, sec.sec_pro_id, sec.sec_ses_number,
                sec.sec_ses_agend_date, sec.sec_ses_exec_date, sec.sec_typ_id,
                sec.sec_med_staff_id, sec.ses_consumed, sec.ses_state,
                sec.user_created, sec.date_created,
                inv.inv_patient_id, pro.pro_name, tht.tht_name
            FROM ceragen.clinic_session_control sec
            JOIN ceragen.admin_invoice inv ON sec.sec_inv_id = inv.inv_id
            JOIN ceragen.admin_product pro ON sec.sec_pro_id = pro.pro_id
            JOIN ceragen.admin_therapy_type tht ON sec.sec_typ_id = tht.tht_id
            WHERE inv.inv_patient_id = %s AND (sec.ses_deleted IS NULL OR sec.ses_deleted = false)
            ORDER BY sec.sec_ses_agend_date DESC;
            """,
            (patient_id,)
        )
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        conn.close()

def update_session_status(session_id: int, consumed: bool, execution_date: datetime = None) -> dict:
    """
    Actualiza el estado de una sesión (consumida y fecha de ejecución).
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            UPDATE ceragen.clinic_session_control
            SET ses_consumed = %s, sec_ses_exec_date = %s, user_modified = 'system', date_modified = now()
            WHERE sec_id = %s
            RETURNING
                sec_id, sec_inv_id, sec_pro_id, sec_ses_number,
                sec_ses_agend_date, sec_ses_exec_date, sec_typ_id,
                sec_med_staff_id, ses_consumed, ses_state,
                user_created, date_created, user_modified, date_modified;
            """,
            (consumed, execution_date or datetime.utcnow(), session_id)
        )
        row = cur.fetchone()
        if not row:
            return None
        cols = [desc[0] for desc in cur.description]
        conn.commit()
        return dict(zip(cols, row))
    finally:
        conn.close()
