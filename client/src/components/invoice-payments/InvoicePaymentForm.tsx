import { useState } from 'react';
import type { InvoicePayment } from '@/services/adminInvoicePaymentService';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useInvoices } from '@/hooks/useInvoices';

interface InvoicePaymentFormProps {
  initial?: Partial<InvoicePayment>;
  onSubmit: (data: Partial<InvoicePayment>) => void;
  onCancel: () => void;
}

export function InvoicePaymentForm({ initial = {}, onSubmit, onCancel }: InvoicePaymentFormProps) {
  const [inp_invoice_id, setInvoiceId] = useState(initial.inp_invoice_id || 0);
  const { invoices, loading } = useInvoices();
  const [inp_amount, setAmount] = useState(initial.inp_amount || 0);
  const [inp_state, setState] = useState(initial.inp_state ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ inp_invoice_id, inp_amount, inp_state });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label>Factura</label>
        <Select
          value={inp_invoice_id ? String(inp_invoice_id) : ''}
          onValueChange={val => setInvoiceId(Number(val))}
          required
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={loading ? 'Cargando...' : 'Selecciona factura'} />
          </SelectTrigger>
          <SelectContent>
            {invoices.map(inv => (
              <SelectItem key={inv.inv_id} value={String(inv.inv_id)}>
                {inv.inv_id} - {inv.inv_date} - {inv.inv_patient_id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label>Monto</label>
        <input
          type='number'
          value={inp_amount}
          onChange={e => setAmount(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label>Estado</label>
        <select
          value={inp_state ? 'true' : 'false'}
          onChange={e => setState(e.target.value === 'true')}
        >
          <option value='true'>Activo</option>
          <option value='false'>Inactivo</option>
        </select>
      </div>
      <div className='flex gap-2'>
        <button type='submit' className='btn btn-primary'>
          Guardar
        </button>
        <button type='button' className='btn btn-secondary' onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
