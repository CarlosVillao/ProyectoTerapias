export type Invoice = {
  inv_id: number;
  inv_patient_id: number;
  inv_date: string;
  inv_total: number;
  inv_state: boolean;
  date_created?: string;
};

export async function getInvoices(): Promise<Invoice[]> {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8000/invoices/', {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if (!res.ok) throw new Error('Error al obtener facturas');
  return await res.json();
}

export async function createInvoice(data: Partial<Invoice>) {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8000/invoices/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear factura');
  return await res.json();
}

export async function updateInvoice(id: number, data: Partial<Invoice>) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8000/invoices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar factura');
  return await res.json();
}

export async function deleteInvoice(id: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8000/invoices/${id}`, {
    method: 'DELETE',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if (!res.ok) throw new Error('Error al eliminar factura');
  return await res.json();
}
