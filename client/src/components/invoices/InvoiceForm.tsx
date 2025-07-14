import { useState } from 'react';
import { usePatients } from '@/hooks/usePatients';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { Invoice } from '@/services/adminInvoiceService';

interface InvoiceFormProps {
  initial?: Partial<Invoice>;
  onSubmit: (data: Partial<Invoice>) => void;
  onCancel: () => void;
}

export function InvoiceForm({ initial = {}, onSubmit, onCancel }: InvoiceFormProps) {
  const [inv_patient_id, setPatientId] = useState(initial.inv_patient_id || 0);
  const { patients, loading } = usePatients();
  const [inv_total, setTotal] = useState(initial.inv_total || 0);
  const [inv_state, setState] = useState(initial.inv_state ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ inv_patient_id, inv_total, inv_state });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label>Paciente</label>
        <Select
          value={inv_patient_id ? String(inv_patient_id) : ''}
          onValueChange={val => setPatientId(Number(val))}
          required
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={loading ? 'Cargando...' : 'Seleccione un paciente'} />
          </SelectTrigger>
          <SelectContent>
            {patients.map(p => (
              <SelectItem key={p.pat_id} value={String(p.pat_id)}>
                {p.per_names} {p.per_surnames} {p.pat_code ? `(${p.pat_code})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label>Total</label>
        <Input
          type='number'
          value={inv_total}
          onChange={e => setTotal(Number(e.target.value))}
          required
          min={0}
          step={0.01}
          placeholder='Total de la factura'
        />
      </div>
      <div>
        <label>Estado</label>
        <Select
          value={inv_state ? 'true' : 'false'}
          onValueChange={val => setState(val === 'true')}
          required
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Estado' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='true'>Activo</SelectItem>
            <SelectItem value='false'>Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex gap-2 justify-end mt-6'>
        <button type='button' className='btn btn-secondary' onClick={onCancel}>
          Cancelar
        </button>
        <button type='submit' className='btn btn-primary bg-blue-600 text-white'>
          Guardar
        </button>
      </div>
    </form>
  );
}
