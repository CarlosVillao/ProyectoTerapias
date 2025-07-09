from app.db.database import get_connection
from app.schemas.patient_schema import PatientCreate
from datetime import datetime

def create_patient(data: PatientCreate) -> dict:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO ceragen.admin_patient (
              pat_person_id, pat_client_id, pat_code,
              pat_medical_conditions, pat_allergies, pat_blood_type,
              pat_emergency_contact_name, pat_emergency_contact_phone,
              pat_state, user_created, date_created
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING
              pat_id, pat_person_id, pat_client_id, pat_code,
              pat_medical_conditions, pat_allergies, pat_blood_type,
              pat_emergency_contact_name, pat_emergency_contact_phone,
              pat_state, user_created, date_created,
              user_modified, date_modified, user_deleted, date_deleted;
            """,
            (
                data.pat_person_id,
                data.pat_client_id,
                data.pat_code,
                data.pat_medical_conditions,
                data.pat_allergies,
                data.pat_blood_type,
                data.pat_emergency_contact_name,
                data.pat_emergency_contact_phone,
                data.pat_state,
                data.user_created,
                data.date_created or datetime.utcnow()
            )
        )
        row = cur.fetchone()
        cols = [d[0] for d in cur.description]
        conn.commit()
        return dict(zip(cols, row))
    finally:
        conn.close()


def get_patient(pat_id: int) -> dict | None:
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            """
            SELECT
              pat_id, pat_person_id, pat_client_id, pat_code,
              pat_medical_conditions, pat_allergies, pat_blood_type,
              pat_emergency_contact_name, pat_emergency_contact_phone,
              pat_state, user_created, date_created,
              user_modified, date_modified, user_deleted, date_deleted
            FROM ceragen.admin_patient
            WHERE pat_id = %s;
            """,
            (pat_id,)
        )
        row = cur.fetchone()
        if not row:
            return None
        cols = [desc[0] for desc in cur.description]
        return dict(zip(cols, row))
    finally:
        conn.close()


