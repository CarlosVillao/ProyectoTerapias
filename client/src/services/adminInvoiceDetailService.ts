export type InvoiceDetail = {
  ind_id: number;
  ind_invoice_id: number;
  ind_product_id: number;
  ind_quantity: number;
  ind_unit_price: number;
  ind_total: number;
  ind_state: boolean;
  date_created?: string;
};

export async function getInvoiceDetails(): Promise<InvoiceDetail[]> {
  const res = await fetch('http://localhost:8000/invoice-details/');
  if (!res.ok) throw new Error('Error al obtener detalles');
  return await res.json();
}

export async function createInvoiceDetail(data: Partial<InvoiceDetail>) {
  const res = await fetch('http://localhost:8000/invoice-details/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear detalle');
  return await res.json();
}

export async function updateInvoiceDetail(id: number, data: Partial<InvoiceDetail>) {
  const res = await fetch(`http://localhost:8000/invoice-details/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar detalle');
  return await res.json();
}

export async function deleteInvoiceDetail(id: number) {
  const res = await fetch(`http://localhost:8000/invoice-details/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar detalle');
  return await res.json();
}
