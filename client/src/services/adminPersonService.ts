import axios from 'axios';

const API_URL = import.meta.env.VITE_ADMINISTRACION_SERVICE_URL || 'http://localhost:8000';

export interface Person {
  per_id?: number;
  per_identification: string;
  per_names: string;
  per_surnames: string;
  per_genre_id: number;
  per_marital_status_id: number;
  per_country: string;
  per_city: string;
  per_address: string;
  per_phone: string;
  per_mail: string;
  per_birth_date: string;
  per_state: boolean;
  user_created: string;
  date_created: string;
  user_modified?: string;
  date_modified?: string;
  user_deleted?: string;
  date_deleted?: string;
}

export async function getPersons(): Promise<Person[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/persons/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function createPerson(person: Partial<Person>): Promise<Person> {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/persons/`, person, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function updatePerson(id: number, person: Partial<Person>): Promise<Person> {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/persons/${id}/`, person, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function deletePerson(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/persons/${id}/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
