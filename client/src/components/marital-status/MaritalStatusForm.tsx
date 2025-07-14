import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { MaritalStatus } from '@/services/adminMaritalStatusService';

interface MaritalStatusFormProps {
  initial?: Partial<MaritalStatus>;
  onSubmit: (data: Partial<MaritalStatus>) => void;
  loading?: boolean;
}

export function MaritalStatusForm({ initial = {}, onSubmit, loading }: MaritalStatusFormProps) {
  const [form, setForm] = useState<Partial<MaritalStatus>>(initial);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='mst_name'
        value={form.mst_name || ''}
        onChange={handleChange}
        placeholder='Nombre'
        required
      />
      <Input
        name='mst_description'
        value={form.mst_description || ''}
        onChange={handleChange}
        placeholder='Descripción'
        required
      />
      <Button type='submit' disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
}
