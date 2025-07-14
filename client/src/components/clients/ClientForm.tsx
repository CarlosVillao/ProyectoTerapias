import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type { Client } from '@/services/adminClientService';

interface ClientFormProps {
  initial?: Partial<Client>;
  onSubmit: (data: Partial<Client>) => void;
  loading?: boolean;
}

export function ClientForm({ initial = {}, onSubmit, loading }: ClientFormProps) {
  const [form, setForm] = useState<Partial<Client>>(initial);
  // Sincroniza el estado del formulario cuando cambian los datos iniciales (por ejemplo, al editar otro cliente)
  useEffect(() => {
    setForm(initial);
  }, [initial]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { user } = useAuth();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    let valid = true;
    let error = '';
    if (name === 'cli_identification') {
      valid = /^\d*$/.test(value);
      if (!valid) error = 'Solo números';
    }
    if (name === 'cli_name') {
      valid = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value);
      if (!valid) error = 'Solo letras';
    }
    if (name === 'cli_mail_bill') {
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
    if (!/^\d+$/.test(form.cli_identification || '')) {
      newErrors.cli_identification = 'Solo números';
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(form.cli_name || '')) {
      newErrors.cli_name = 'Solo letras';
    }
    if (form.cli_mail_bill && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.cli_mail_bill)) {
      newErrors.cli_mail_bill = 'Email inválido';
    }
    // Validación automática para evitar valores por defecto o de prueba
    if (form.cli_identification === 'string') {
      newErrors.cli_identification = 'No puede ser "string"';
    }
    if (form.cli_name === 'string') {
      newErrors.cli_name = 'No puede ser "string"';
    }
    if (form.cli_address_bill === 'string') {
      newErrors.cli_address_bill = 'No puede ser "string"';
    }
    if (form.cli_mail_bill === 'string') {
      newErrors.cli_mail_bill = 'No puede ser "string"';
    }
    if ('cli_person_id' in form && (form.cli_person_id === 0 || form.cli_person_id === undefined)) {
      newErrors.cli_person_id = 'Debe seleccionar una persona válida';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Agregar campos requeridos por el backend si no están presentes
      const payload = {
        ...form,
        cli_person_id: form.cli_person_id ?? 1, // Cambia 1 por el valor correcto si tienes selección de persona
        cli_state: form.cli_state ?? true,
        user_created: user?.id ? String(user.id) : '998',
        date_created: new Date().toISOString(),
      };
      onSubmit(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <Input
        name='cli_identification'
        value={form.cli_identification || ''}
        onChange={handleChange}
        placeholder='Identificación'
        required
        maxLength={20}
      />
      {errors.cli_identification && (
        <div className='text-red-500 text-xs'>{errors.cli_identification}</div>
      )}
      <Input
        name='cli_name'
        value={form.cli_name || ''}
        onChange={handleChange}
        placeholder='Nombre'
        required
        maxLength={50}
      />
      {errors.cli_name && <div className='text-red-500 text-xs'>{errors.cli_name}</div>}
      <Input
        name='cli_address_bill'
        value={form.cli_address_bill || ''}
        onChange={handleChange}
        placeholder='Dirección de Facturación'
        required
      />
      {errors.cli_address_bill && (
        <div className='text-red-500 text-xs'>{errors.cli_address_bill}</div>
      )}
      <Input
        name='cli_mail_bill'
        value={form.cli_mail_bill || ''}
        onChange={handleChange}
        placeholder='Email de Facturación'
        required
        type='email'
      />
      {errors.cli_mail_bill && <div className='text-red-500 text-xs'>{errors.cli_mail_bill}</div>}
      <div className='flex items-center gap-2'>
        <span>Activo</span>
        <Switch
          checked={form.cli_state ?? true}
          onCheckedChange={val => handleSwitch('cli_state', val)}
        />
      </div>
      <Button type='submit' disabled={loading || Object.values(errors).some(e => !!e)}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
}
