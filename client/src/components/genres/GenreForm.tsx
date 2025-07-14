import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Genre } from '@/services/adminGenreService';

interface GenreFormProps {
  initial?: Partial<Genre>;
  onSubmit: (data: Partial<Genre>) => void;
  loading?: boolean;
}

export function GenreForm({ initial = {}, onSubmit, loading }: GenreFormProps) {
  const [form, setForm] = useState<Partial<Genre>>(initial);

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
        name='gen_name'
        value={form.gen_name || ''}
        onChange={handleChange}
        placeholder='Nombre'
        required
      />
      <Input
        name='gen_description'
        value={form.gen_description || ''}
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
