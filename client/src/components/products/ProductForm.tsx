import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { Product } from '@/services/adminProductService';

interface ProductFormProps {
  initial?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => void;
  loading?: boolean;
}

export function ProductForm({ initial = {}, onSubmit, loading }: ProductFormProps) {
  const [form, setForm] = useState<Partial<Product>>(initial);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSwitch(name: string, value: boolean) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='pro_code'
        value={form.pro_code || ''}
        onChange={handleChange}
        placeholder='Código'
        required
      />
      <Input
        name='pro_name'
        value={form.pro_name || ''}
        onChange={handleChange}
        placeholder='Nombre'
        required
      />
      <Input
        name='pro_description'
        value={form.pro_description || ''}
        onChange={handleChange}
        placeholder='Descripción'
        required
      />
      <Input
        name='pro_price'
        value={form.pro_price || ''}
        onChange={handleChange}
        placeholder='Precio'
        required
        type='number'
      />
      <Input
        name='pro_total_sessions'
        value={form.pro_total_sessions?.toString() || ''}
        onChange={handleChange}
        placeholder='Total Sesiones'
        required
        type='number'
      />
      <Input
        name='pro_duration_days'
        value={form.pro_duration_days?.toString() || ''}
        onChange={handleChange}
        placeholder='Duración (días)'
        required
        type='number'
      />
      <Input
        name='pro_image_url'
        value={form.pro_image_url || ''}
        onChange={handleChange}
        placeholder='URL Imagen'
      />
      <Input
        name='pro_therapy_type_id'
        value={form.pro_therapy_type_id?.toString() || ''}
        onChange={handleChange}
        placeholder='ID Tipo Terapia'
        required
        type='number'
      />
      <div className='flex items-center gap-2'>
        <span>Activo</span>
        <Switch
          checked={form.pro_state ?? true}
          onCheckedChange={val => handleSwitch('pro_state', val)}
        />
      </div>
      <Button type='submit' disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
}
