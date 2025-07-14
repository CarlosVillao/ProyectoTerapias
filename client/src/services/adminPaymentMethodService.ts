import axios from 'axios';

const API_URL = import.meta.env.VITE_ADMINISTRACION_SERVICE_URL || 'http://localhost:8000';

export interface PaymentMethod {
  pym_name: string;
  pym_description: string;
  pym_id: number;
  date_created: string;
  user_created: string;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/payment-methods/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function createPaymentMethod(pm: Partial<PaymentMethod>): Promise<PaymentMethod> {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/payment-methods/`, pm, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function updatePaymentMethod(
  id: number,
  pm: Partial<PaymentMethod>,
): Promise<PaymentMethod> {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/payment-methods/${id}/`, pm, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return response.data;
}

export async function deletePaymentMethod(id: number): Promise<void> {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/payment-methods/${id}/`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
