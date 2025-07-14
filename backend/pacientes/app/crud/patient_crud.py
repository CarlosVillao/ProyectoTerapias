
def get_patient_history(pat_id: int) -> dict:
    """
    Recupera el historial clínico completo de un paciente (por pat_id), incluyendo datos generales, episodios médicos, alergias y enfermedades.
    """
    # Datos generales del paciente (de admin_patient)
    patient_info = None
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            '''
            SELECT * FROM ceragen.admin_patient WHERE pat_id = %s;
            '''
            , (pat_id,)
        )
        row = cur.fetchone()
        if row:
            cols = [desc[0] for desc in cur.description]
            patient_info = dict(zip(cols, row))
    finally:
        conn.close()

    # Episodios médicos
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            '''
            SELECT
                hist_id, hist_patient_id, hist_primary_complaint,
                hist_onset_date, hist_related_trauma, hist_current_treatment,
                hist_notes, user_created, date_created,
                user_modified, date_modified, user_deleted, date_deleted
            FROM ceragen.clinic_patient_medical_history
            WHERE hist_patient_id = %s
            ORDER BY hist_id;
            ''',
            (pat_id,)
        )
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        episodes = [dict(zip(cols, row)) for row in rows]
    finally:
        conn.close()

    # Alergias
    allergies = get_patient_allergies(pat_id)
    # Enfermedades
    diseases = get_patient_diseases(pat_id)

    return {
        "patient": patient_info,
        "episodes": episodes,
        "allergies": allergies,
        "diseases": diseases
    }
from app.db.database import get_connection
from app.schemas.patient_schema import PatientCreate
from datetime import datetime

def get_patients(skip: int = 0, limit: int = 100) -> list[dict]:
    """
    Recupera una lista de historiales médicos de pacientes con paginación.
    Devuelve una lista de diccionarios con los datos de los historiales médicos.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
                hist_id, hist_patient_id, hist_primary_complaint,
                hist_onset_date, hist_related_trauma, hist_current_treatment,
                hist_notes, user_created, date_created,
                user_modified, date_modified, user_deleted, date_deleted
            FROM ceragen.clinic_patient_medical_history
            ORDER BY hist_id
            LIMIT %s OFFSET %s;
            """,
            (limit, skip)
        )
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        conn.close()

def create_patient(data: PatientCreate) -> dict:
    """
    Crea un nuevo historial médico de paciente.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.clinic_patient_medical_history (
                hist_patient_id, hist_primary_complaint, hist_onset_date,
                hist_related_trauma, hist_current_treatment, hist_notes,
                user_created, date_created
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING
                hist_id, hist_patient_id, hist_primary_complaint,
                hist_onset_date, hist_related_trauma, hist_current_treatment,
                hist_notes, user_created, date_created,
                user_modified, date_modified, user_deleted, date_deleted;
            """,
            (
                data.patient_id,
                data.primary_complaint,
                data.onset_date,
                data.related_trauma,
                data.current_treatment,
                data.notes,
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

def get_patient(id: int) -> dict | None:
    """
    Recupera el detalle completo de un paciente por ID, incluyendo datos generales, historial médico, alergias y enfermedades.
    """
    # Datos generales del paciente (de admin_patient)
    patient_info = None
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            '''
            SELECT * FROM ceragen.admin_patient WHERE pat_id = %s;
            ''',
            (id,)
        )
        row = cur.fetchone()
        if row:
            cols = [desc[0] for desc in cur.description]
            patient_info = dict(zip(cols, row))
    finally:
        conn.close()

    # Episodios médicos
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            '''
            SELECT
                hist_id,
                hist_patient_id AS patient_id,
                hist_primary_complaint AS primary_complaint,
                hist_onset_date AS onset_date,
                hist_related_trauma AS related_trauma,
                hist_current_treatment AS current_treatment,
                hist_notes AS notes,
                user_created, date_created,
                user_modified, date_modified, user_deleted, date_deleted
            FROM ceragen.clinic_patient_medical_history
            WHERE hist_patient_id = %s
            ORDER BY hist_id;
            ''',
            (id,)
        )
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        episodes = [dict(zip(cols, row)) for row in rows]
    finally:
        conn.close()

    # Alergias
    allergies = get_patient_allergies(id)
    # Enfermedades
    diseases = get_patient_diseases(id)

    if not patient_info:
        return None

    # Map fields to PatientDetail schema
    result = {
        "id": patient_info["pat_id"],
        "first_name": patient_info.get("pat_first_name", ""),
        "last_name": patient_info.get("pat_last_name", ""),
        "birth_date": str(patient_info.get("pat_birth_date")) if patient_info.get("pat_birth_date") else None,
        "gender": patient_info.get("pat_gender"),
        "marital_status": patient_info.get("pat_marital_status"),
        "phone": patient_info.get("pat_phone"),
        "email": patient_info.get("pat_email"),
        "address": patient_info.get("pat_address"),
        "allergies": [
            {
                "id": a.get("pa_id"),
                "name": a.get("al_name"),
                "description": a.get("al_description")
            } for a in allergies
        ],
        "diseases": [
            {
                "id": d.get("pd_id"),
                "name": d.get("dis_name"),
                "description": d.get("dis_description")
            } for d in diseases
        ],
        "medical_history": [
            {
                "id": e.get("hist_id"),
                "date": str(e.get("onset_date")),
                "diagnosis": e.get("primary_complaint"),
                "treatment": e.get("current_treatment"),
                "notes": e.get("notes")
            } for e in episodes
        ]
    }
    return result

def get_patient_allergies(patient_id: int) -> list[dict]:
    """
    Recupera las alergias de un paciente específico.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
                pa.pa_id, pa.pa_patient_id, pa.pa_allergy_id, pa.pa_reaction_description,
                pa.user_created AS pa_user_created, pa.date_created AS pa_date_created,
                pa.user_modified AS pa_user_modified, pa.date_modified AS pa_date_modified,
                pa.user_deleted AS pa_user_deleted, pa.date_deleted AS pa_date_deleted,
                al.al_name, al.al_description
            FROM ceragen.clinic_patient_allergy pa
            JOIN ceragen.clinic_allergy_catalog al ON pa.pa_allergy_id = al.al_id
            WHERE pa.pa_patient_id = %s AND pa.date_deleted IS NULL
            ORDER BY pa.pa_id;
            """,
            (patient_id,)
        )
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        conn.close()

def get_patient_diseases(patient_id: int) -> list[dict]:
    """
    Recupera las enfermedades de un paciente específico.
    """
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
                pd.pd_id, pd.pd_patient_id, pd.pd_disease_id, pd.pd_is_current, pd.pd_notes,
                pd.user_created AS pd_user_created, pd.date_created AS pd_date_created,
                pd.user_modified AS pd_user_modified, pd.date_modified AS pd_date_modified,
                pd.user_deleted AS pd_user_deleted, pd.date_deleted AS pd_date_deleted,
                dis.dis_name, dis.dis_description, dst.dst_name
            FROM ceragen.clinic_patient_disease pd
            JOIN ceragen.clinic_disease_catalog dis ON pd.pd_disease_id = dis.dis_id
            JOIN ceragen.clinic_disease_type dst ON dis.dis_type_id = dst.dst_id
            WHERE pd.pd_patient_id = %s AND pd.date_deleted IS NULL
            ORDER BY pd.pd_id;
            """,
            (patient_id,)
        )
        rows = cur.fetchall()
        cols = [desc[0] for desc in cur.description]
        return [dict(zip(cols, row)) for row in rows]
    finally:
        conn.close()
