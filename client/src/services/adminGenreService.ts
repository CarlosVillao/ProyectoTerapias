import axios from 'axios';

const API_URL = import.meta.env.VITE_ADMINISTRACION_SERVICE_URL || 'http://localhost:8000';

export interface Genre {
  gen_name: string;
  gen_description: string;
  gen_id: number;
  date_created: string;
  user_created: string;
}

export async function getGenres(): Promise<Genre[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/genres/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function createGenre(genre: Partial<Genre>): Promise<Genre> {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/genres/`, genre, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function updateGenre(id: number, genre: Partial<Genre>): Promise<Genre> {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/genres/${id}/`, genre, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function deleteGenre(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/genres/${id}/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
