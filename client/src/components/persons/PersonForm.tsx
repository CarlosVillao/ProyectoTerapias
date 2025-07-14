import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useGenres } from '@/hooks/useGenres';
import { useMaritalStatuses } from '@/hooks/useMaritalStatuses';
import type { Person } from '@/services/adminPersonService';

interface PersonFormProps {
  initial?: Partial<Person>;
  onSubmit: (data: Partial<Person>) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function PersonForm({ initial = {}, onSubmit, onCancel, loading }: PersonFormProps) {
  const [form, setForm] = useState<Partial<Person>>(initial);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { genres, loading: loadingGenres } = useGenres();
  const { maritalStatuses, loading: loadingMarital } = useMaritalStatuses();
  const { user } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let valid = true;
    let error = '';
    if (name === 'per_identification') {
      valid = /^\d*$/.test(value);
      if (!valid) error = 'Solo números';
    }
    if (name === 'per_names' || name === 'per_surnames') {
      valid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value);
      if (!valid) error = 'Solo letras';
    }
    if (name === 'per_phone') {
      valid = /^\d*$/.test(value);
      if (!valid) error = 'Solo números';
    }
    if (name === 'per_mail') {
      // Permitir escribir cualquier valor, solo mostrar error si no está vacío y es inválido
      if (value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
        error = 'Email inválido';
      }
      setForm(f => ({ ...f, [name]: value }));
      setErrors(errs => ({ ...errs, [name]: error }));
      return;
    }
    setErrors(errs => ({ ...errs, [name]: error }));
    if (valid) {
      setForm(f => ({ ...f, [name]: value }));
    }
  }

  function handleSwitch(name: string, value: boolean) {
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Validaciones finales antes de enviar
    const newErrors: { [key: string]: string } = {};
    if (!/^\d+$/.test(form.per_identification || '')) {
      newErrors.per_identification = 'Solo números';
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.per_names || '')) {
      newErrors.per_names = 'Solo letras';
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.per_surnames || '')) {
      newErrors.per_surnames = 'Solo letras';
    }
    if (form.per_phone && !/^\d+$/.test(form.per_phone)) {
      newErrors.per_phone = 'Solo números';
    }
    if (form.per_mail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.per_mail)) {
      newErrors.per_mail = 'Email inválido';
    }
    // Validación automática para evitar valores por defecto o de prueba
    if (form.per_identification === 'string') {
      newErrors.per_identification = 'No puede ser "string"';
    }
    if (form.per_names === 'string') {
      newErrors.per_names = 'No puede ser "string"';
    }
    if (form.per_surnames === 'string') {
      newErrors.per_surnames = 'No puede ser "string"';
    }
    if (form.per_country === 'string') {
      newErrors.per_country = 'No puede ser "string"';
    }
    if (form.per_city === 'string') {
      newErrors.per_city = 'No puede ser "string"';
    }
    if (form.per_address === 'string') {
      newErrors.per_address = 'No puede ser "string"';
    }
    if (form.per_phone === 'string') {
      newErrors.per_phone = 'No puede ser "string"';
    }
    if (form.per_mail === 'string' || form.per_mail === 'user@example.com') {
      newErrors.per_mail = 'No puede ser "string" ni "user@example.com"';
    }
    if (form.per_genre_id === 0 || form.per_genre_id === undefined) {
      newErrors.per_genre_id = 'Seleccione un género válido';
    }
    if (form.per_marital_status_id === 0 || form.per_marital_status_id === undefined) {
      newErrors.per_marital_status_id = 'Seleccione un estado civil válido';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      const payload = {
        ...form,
        per_genre_id: form.per_genre_id,
        per_marital_status_id: form.per_marital_status_id,
        per_state: form.per_state ?? true,
        user_created: user?.id ? String(user.id) : '998',
        date_created: new Date().toISOString(),
      };
      onSubmit(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='per_identification'
        value={form.per_identification || ''}
        onChange={handleChange}
        placeholder='Identificación'
        required
        maxLength={20}
      />
      {errors.per_identification && (
        <div className='text-red-500 text-xs'>{errors.per_identification}</div>
      )}
      <Input
        name='per_names'
        value={form.per_names || ''}
        onChange={handleChange}
        placeholder='Nombres'
        required
        maxLength={50}
      />
      {errors.per_names && <div className='text-red-500 text-xs'>{errors.per_names}</div>}
      <Input
        name='per_surnames'
        value={form.per_surnames || ''}
        onChange={handleChange}
        placeholder='Apellidos'
        required
        maxLength={50}
      />
      {errors.per_surnames && <div className='text-red-500 text-xs'>{errors.per_surnames}</div>}
      <Select
        value={form.per_genre_id?.toString() || ''}
        onValueChange={val => setForm(f => ({ ...f, per_genre_id: val ? Number(val) : undefined }))}
        required
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Género' />
        </SelectTrigger>
        <SelectContent>
          {loadingGenres ? (
            <SelectItem value='loading' disabled>
              Cargando...
            </SelectItem>
          ) : (
            genres.map(g => (
              <SelectItem key={g.gen_id} value={g.gen_id.toString()}>
                {g.gen_name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <Select
        value={form.per_marital_status_id?.toString() || ''}
        onValueChange={val =>
          setForm(f => ({ ...f, per_marital_status_id: val ? Number(val) : undefined }))
        }
        required
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Estado Civil' />
        </SelectTrigger>
        <SelectContent>
          {loadingMarital ? (
            <SelectItem value='loading' disabled>
              Cargando...
            </SelectItem>
          ) : (
            maritalStatuses.map(m => (
              <SelectItem key={m.mst_id} value={m.mst_id.toString()}>
                {m.mst_name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <Input
        name='per_country'
        value={form.per_country || ''}
        onChange={handleChange}
        placeholder='País'
        required
      />
      <Input
        name='per_city'
        value={form.per_city || ''}
        onChange={handleChange}
        placeholder='Ciudad'
        required
      />
      <Input
        name='per_address'
        value={form.per_address || ''}
        onChange={handleChange}
        placeholder='Dirección'
        required
      />
      <Input
        name='per_phone'
        value={form.per_phone || ''}
        onChange={handleChange}
        placeholder='Teléfono'
        required
        maxLength={20}
      />
      {errors.per_phone && <div className='text-red-500 text-xs'>{errors.per_phone}</div>}
      <Input
        name='per_mail'
        value={form.per_mail || ''}
        onChange={handleChange}
        placeholder='Email'
        required
        type='email'
      />
      {errors.per_mail && <div className='text-red-500 text-xs'>{errors.per_mail}</div>}
      <Input
        name='per_birth_date'
        value={form.per_birth_date || ''}
        onChange={handleChange}
        placeholder='Fecha de nacimiento'
        required
        type='date'
      />
      <div className='flex items-center gap-2'>
        <span>Activo</span>
        <Switch
          checked={form.per_state ?? true}
          onCheckedChange={val => handleSwitch('per_state', val)}
        />
      </div>
      <div className='flex gap-2 justify-end mt-6'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type='submit'
          disabled={loading || Object.values(errors).some(e => !!e)}
          className='bg-blue-600 text-white'
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
