import axios from 'axios';

const API_URL = import.meta.env.VITE_ADMINISTRACION_SERVICE_URL || 'http://localhost:8000';

export interface Patient {
  patient_id: number;
  patient_person_id: number;
  patient_state: boolean;
  user_created: string;
  date_created: string;
  user_modified?: string;
  date_modified?: string;
  user_deleted?: string;
  date_deleted?: string;
}

export async function getPatients(): Promise<Patient[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/patients/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function createPatient(patient: Partial<Patient>): Promise<Patient> {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/patients/`, patient, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function updatePatient(id: number, patient: Partial<Patient>): Promise<Patient> {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/patients/${id}/`, patient, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function deletePatient(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/patients/${id}/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
