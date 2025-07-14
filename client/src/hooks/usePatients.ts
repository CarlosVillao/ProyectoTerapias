import { useEffect, useState, useCallback } from 'react';

// Modelo persona
export interface Person {
  per_id?: number;
  per_names?: string;
  per_surnames?: string;
  per_birth_date?: string;
  per_genre_id?: number;
  per_marital_status_id?: number;
  per_country?: string;
  per_city?: string;
  per_address?: string;
  per_phone?: string;
  per_mail?: string;
  per_identification?: string;
  per_state?: boolean;
  user_created?: string;
  date_created?: string;
  user_modified?: string;
  date_modified?: string;
  user_deleted?: string;
  date_deleted?: string;
}

// Modelo cliente
export interface Client {
  cli_id?: number;
  cli_person_id: number;
  cli_identification?: string;
  cli_name?: string;
  cli_address_bill?: string;
  cli_mail_bill?: string;
  cli_code?: string;
  cli_state?: boolean;
  user_created?: string;
  date_created?: string;
  user_modified?: string;
  date_modified?: string;
  user_deleted?: string;
  date_deleted?: string;
}

// Modelo paciente
export interface AdminPatient {
  pat_id?: number;
  pat_person_id: number;
  pat_client_id: number;
  pat_code?: string;
  pat_medical_conditions?: string;
  pat_allergies?: string;
  pat_blood_type?: string;
  pat_emergency_contact_name?: string;
  pat_emergency_contact_phone?: string;
  pat_state?: boolean;
  user_created?: string;
  date_created?: string;
  user_modified?: string;
  date_modified?: string;
  user_deleted?: string;
  date_deleted?: string;
}

// Modelo clínico
export interface MedicalHistory {
  patient_id: number;
  primary_complaint: string;
  onset_date: string;
  related_trauma: boolean;
  current_treatment: string;
  notes: string;
  hist_id: number;
  user_created: string;
  date_created: string;
  user_modified: string;
  date_modified: string;
  user_deleted: string;
  date_deleted: string;
}

export interface PatientAllergy {
  id: number;
  name: string;
  description?: string;
}

export interface PatientDisease {
  id: number;
  name: string;
  description?: string;
}

export interface PatientDetail {
  pat_state: boolean;
  pat_emergency_contact_name?: string;
  pat_emergency_contact_phone?: string;
  // Persona
  per_id?: number;
  per_names?: string;
  per_surnames?: string;
  per_birth_date?: string;
  per_genre_id?: number;
  per_marital_status_id?: number;
  per_country?: string;
  per_city?: string;
  per_address?: string;
  per_phone?: string;
  per_mail?: string;
  per_identification?: string;
  per_state?: boolean;
  user_created?: string;
  date_created?: string;
  user_modified?: string;
  date_modified?: string;
  user_deleted?: string;
  date_deleted?: string;
  // Cliente
  cli_id?: number;
  cli_person_id?: number;
  cli_identification?: string;
  cli_name?: string;
  cli_address_bill?: string;
  cli_mail_bill?: string;
  cli_code?: string;
  cli_state?: boolean;
  medical_history: MedicalHistory[];
  allergies?: PatientAllergy[];
  diseases?: PatientDisease[];
  pat_id?: number;
  pat_code?: string;
  pat_medical_conditions?: string;
  pat_allergies?: string;
  pat_blood_type?: string;
}

const ADMIN_URL = import.meta.env.ADMINISTRACION_SERVICE_URL || 'http://localhost:8000';
const PACIENTES_URL = import.meta.env.PACIENTES_SERVICE_URL || 'http://localhost:8001';

// Obtiene pacientes administrativos
async function getAdminPatients(): Promise<AdminPatient[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${ADMIN_URL}/patients/`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw new Error('Error al obtener pacientes administrativos');
  return await res.json();
}

// Obtiene persona por ID
export async function getPerson(per_id: number): Promise<Person> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${ADMIN_URL}/persons/${per_id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw new Error('Error al obtener persona');
  return await res.json();
}

// Obtiene cliente por ID
export async function getClient(cli_id: number): Promise<Client> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${ADMIN_URL}/clients/${cli_id}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
  if (!res.ok) throw new Error('Error al obtener cliente');
  return await res.json();
}
// Actualiza persona
export async function updatePerson(per_id: number, data: Partial<Person>): Promise<Person> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${ADMIN_URL}/persons/${per_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar persona');
  return await res.json();
}

// Actualiza cliente
export async function updateClient(cli_id: number, data: Partial<Client>): Promise<Client> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${ADMIN_URL}/clients/${cli_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar cliente');
  return await res.json();
}

// Obtiene detalle de paciente por ID usando el endpoint correcto
async function getPatientHistory(pat_id: number): Promise<{
  medical_history?: MedicalHistory[];
  allergies?: PatientAllergy[];
  diseases?: PatientDisease[];
  pat_id?: number;
  pat_person_id?: number;
  pat_client_id?: number;
  pat_code?: string;
  pat_medical_conditions?: string;
  pat_allergies?: string;
  pat_blood_type?: string;
  pat_emergency_contact_name?: string;
  pat_emergency_contact_phone?: string;
  pat_state?: boolean;
  user_created?: string;
  date_created?: string;
  user_modified?: string;
  date_modified?: string;
  user_deleted?: string;
  date_deleted?: string;
}> {
  const res = await fetch(`${PACIENTES_URL}/patients/${pat_id}`);
  if (!res.ok) throw new Error('Error al obtener historial clínico');
  return await res.json();
}

export function usePatients(refresh = 0) {
  const [patients, setPatients] = useState<PatientDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const adminPatients = await getAdminPatients();
      const details: PatientDetail[] = await Promise.all(
        adminPatients.map(async p => {
          try {
            // Fetch persona y cliente
            const [person, client, history] = await Promise.all([
              getPerson(p.pat_person_id),
              getClient(p.pat_client_id),
              getPatientHistory(p.pat_id!),
            ]);
            return {
              ...p,
              ...person,
              ...client,
              medical_history: history.medical_history || [],
              allergies: history.allergies || [],
              diseases: history.diseases || [],
              pat_state: typeof p.pat_state === 'boolean' ? p.pat_state : false,
            };
          } catch {
            return {
              ...p,
              medical_history: [],
              allergies: [],
              diseases: [],
              pat_state: typeof p.pat_state === 'boolean' ? p.pat_state : false,
            };
          }
        }),
      );
      setPatients(details);
    } catch {
      setError('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line
  }, [refresh]);

  return { patients, loading, error };
}
