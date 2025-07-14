import axios from 'axios';

const API_URL = import.meta.env.VITE_ADMINISTRACION_SERVICE_URL || 'http://localhost:8000';

export interface Product {
  pro_code: string;
  pro_name: string;
  pro_description: string;
  pro_price: string;
  pro_total_sessions: number;
  pro_duration_days: number;
  pro_image_url: string;
  pro_therapy_type_id: number;
  pro_state: boolean;
  pro_id: number;
  user_created: string;
  date_created: string;
  user_modified?: string;
  date_modified?: string;
  user_deleted?: string;
  date_deleted?: string;
}

export async function getProducts(): Promise<Product[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/products/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/products/`, product, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product> {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/products/${id}/`, product, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/products/${id}/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
