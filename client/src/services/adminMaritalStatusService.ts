import axios from 'axios';

const API_URL = import.meta.env.VITE_ADMINISTRACION_SERVICE_URL || 'http://localhost:8000';

export interface MaritalStatus {
  mst_name: string;
  mst_description: string;
  mst_id: number;
  date_created: string;
  user_created: string;
}

export async function getMaritalStatuses(): Promise<MaritalStatus[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/marital-status/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function createMaritalStatus(ms: Partial<MaritalStatus>): Promise<MaritalStatus> {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/marital-status/`, ms, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function updateMaritalStatus(
  id: number,
  ms: Partial<MaritalStatus>,
): Promise<MaritalStatus> {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/marital-status/${id}/`, ms, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function deleteMaritalStatus(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/marital-status/${id}/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
