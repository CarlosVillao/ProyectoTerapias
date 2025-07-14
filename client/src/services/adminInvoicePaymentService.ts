export type InvoicePayment = {
  inp_id: number;
  inp_invoice_id: number;
  inp_amount: number;
  inp_date: string;
  inp_state: boolean;
  date_created?: string;
};

export async function getInvoicePayments(): Promise<InvoicePayment[]> {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8000/invoice-payments/', {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if (!res.ok) throw new Error('Error al obtener pagos');
  return await res.json();
}

export async function createInvoicePayment(data: Partial<InvoicePayment>) {
  const token = localStorage.getItem('token');
  const res = await fetch('http://localhost:8000/invoice-payments/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear pago');
  return await res.json();
}

export async function updateInvoicePayment(id: number, data: Partial<InvoicePayment>) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8000/invoice-payments/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar pago');
  return await res.json();
}

export async function deleteInvoicePayment(id: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:8000/invoice-payments/${id}`, {
    method: 'DELETE',
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  });
  if (!res.ok) throw new Error('Error al eliminar pago');
  return await res.json();
}
