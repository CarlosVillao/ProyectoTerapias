import React, { useState } from 'react';
import type { SessionCreate } from '@/services/sessionService';
import type { Invoice } from '@/services/adminInvoiceService';
import type { InvoicePayment } from '@/services/adminInvoicePaymentService';
import { Button } from '@/components/ui/button';

interface SessionFormProps {
  initial?: Partial<SessionCreate>;
  invoices: Invoice[];
  payments: InvoicePayment[];
  onSubmit: (data: Partial<SessionCreate>) => void;
  onCancel: () => void;
}

export const SessionForm: React.FC<SessionFormProps> = ({
  initial = {},
  invoices,
  payments,
  onSubmit,
  onCancel,
}) => {
  const [form, setForm] = useState<Partial<SessionCreate>>(initial);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block mb-1'>Factura</label>
        <select
          name='invoice_id'
          value={form.invoice_id ?? ''}
          onChange={handleChange}
          className='input'
        >
          <option value=''>Seleccione una factura</option>
          {invoices.map(inv => (
            <option key={inv.inv_id} value={inv.inv_id}>
              {inv.inv_id} - Total: {inv.inv_total}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className='block mb-1'>Producto</label>
        <input
          name='product_id'
          value={form.product_id ?? ''}
          onChange={handleChange}
          className='input'
        />
      </div>
      <div>
        <label className='block mb-1'>Número de Sesión</label>
        <input
          name='session_number'
          value={form.session_number ?? ''}
          onChange={handleChange}
          className='input'
        />
      </div>
      <div>
        <label className='block mb-1'>Fecha Programada</label>
        <input
          type='datetime-local'
          name='scheduled_date'
          value={form.scheduled_date ?? ''}
          onChange={handleChange}
          className='input'
        />
      </div>
      <div>
        <label className='block mb-1'>Fecha Ejecución</label>
        <input
          type='datetime-local'
          name='execution_date'
          value={form.execution_date ?? ''}
          onChange={handleChange}
          className='input'
        />
      </div>
      <div>
        <label className='block mb-1'>Consumida</label>
        <select
          name='consumed'
          value={form.consumed ? 'true' : 'false'}
          onChange={handleChange}
          className='input'
        >
          <option value='false'>No</option>
          <option value='true'>Sí</option>
        </select>
      </div>
      <div>
        <label className='block mb-1'>Estado</label>
        <select
          name='state'
          value={form.state ? 'true' : 'false'}
          onChange={handleChange}
          className='input'
        >
          <option value='true'>Activa</option>
          <option value='false'>Inactiva</option>
        </select>
      </div>
      <div>
        <label className='block mb-1'>Método de Pago</label>
        <div className='input'>
          {form.invoice_id
            ? payments.find(pay => pay.inp_invoice_id === Number(form.invoice_id))?.inp_amount ??
              'No asignado'
            : 'No asignado'}
        </div>
      </div>
      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
        <Button type='submit'>Guardar</Button>
      </div>
    </form>
  );
};
