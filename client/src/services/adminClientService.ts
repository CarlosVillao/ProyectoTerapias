import axios from 'axios';

const API_URL = import.meta.env.VITE_ADMINISTRACION_SERVICE_URL || 'http://localhost:8000';

export interface Client {
  cli_person_id: number;
  cli_identification: string;
  cli_name: string;
  cli_address_bill: string;
  cli_mail_bill: string;
  cli_state: boolean;
  cli_id: number;
  user_created: string;
  date_created: string;
  user_modified: string;
  date_modified: string;
  user_deleted: string;
  date_deleted: string;
}

export async function getClients(): Promise<Client[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/clients`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function createClient(client: Partial<Client>): Promise<Client> {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/clients`, client, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function updateClient(id: number, client: Partial<Client>): Promise<Client> {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/clients/${id}`, client, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function deleteClient(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/clients/${id}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
