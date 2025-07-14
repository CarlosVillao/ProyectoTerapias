import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PaymentMethod } from '@/services/adminPaymentMethodService';

interface PaymentMethodFormProps {
  initial?: Partial<PaymentMethod>;
  onSubmit: (data: Partial<PaymentMethod>) => void;
  loading?: boolean;
}

export function PaymentMethodForm({ initial = {}, onSubmit, loading }: PaymentMethodFormProps) {
  const [form, setForm] = useState<Partial<PaymentMethod>>(initial);

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
        name='pym_name'
        value={form.pym_name || ''}
        onChange={handleChange}
        placeholder='Nombre'
        required
      />
      <Input
        name='pym_description'
        value={form.pym_description || ''}
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
