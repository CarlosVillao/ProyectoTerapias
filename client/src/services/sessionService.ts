import axios from 'axios';

const apiUrl = import.meta.env.VITE_PACIENTES_SERVICE_URL || 'http://localhost:8001';

export interface Session {
  invoice_id: number;
  product_id: number;
  session_number: number;
  scheduled_date: string;
  execution_date: string;
  therapy_type_id: number;
  medical_staff_id: number;
  consumed: boolean;
  state: boolean;
  sec_id: number;
  user_created: string;
  date_created: string;
  user_modified: string;
  date_modified: string;
  user_deleted: string;
  date_deleted: string;
}

export interface SessionCreate {
  invoice_id: number;
  product_id: number;
  session_number: number;
  scheduled_date: string;
  execution_date: string;
  therapy_type_id: number;
  medical_staff_id: number;
  consumed: boolean;
  state: boolean;
  sec_id: number;
  user_created: string;
  date_created: string;
  user_modified: string;
  date_modified: string;
  user_deleted: string;
  date_deleted: string;
}

export const getSessions = async (skip = 0, limit = 100) =>
  axios.get<Session[]>(`${apiUrl}/sessions?skip=${skip}&limit=${limit}`);

export const getSession = async (session_id: number) =>
  axios.get<Session>(`${apiUrl}/sessions/${session_id}`);

export const getSessionsByPatient = async (patient_id: number) =>
  axios.get<Session[]>(`${apiUrl}/sessions/patient/${patient_id}`);

export const createSession = async (data: SessionCreate) =>
  axios.post<Session>(`${apiUrl}/sessions/`, data);

export const updateSessionStatus = async (
  session_id: number,
  consumed: boolean,
  execution_date?: string,
) =>
  axios.patch<Session>(`${apiUrl}/sessions/${session_id}/status`, {
    consumed,
    execution_date,
  });
