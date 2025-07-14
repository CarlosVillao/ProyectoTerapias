import React, { useState } from 'react';
import type { PatientDetail } from '@/hooks/usePatients';
import { Button } from '@/components/ui/button';

interface PatientFormProps {
  initial?: Partial<PatientDetail>;
  onSubmit: (data: Partial<PatientDetail>) => void;
  loading?: boolean;
  onCancel?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({
  initial = {},
  onSubmit,
  loading,
  onCancel,
}) => {
  // Solo campos requeridos para paciente
  const [form, setForm] = useState<
    Required<
      Pick<
        PatientDetail,
        | 'pat_code'
        | 'pat_medical_conditions'
        | 'pat_allergies'
        | 'pat_blood_type'
        | 'pat_emergency_contact_name'
        | 'pat_emergency_contact_phone'
        | 'pat_state'
      >
    > & { pat_id?: number }
  >({
    pat_code: initial.pat_code || '',
    pat_medical_conditions: initial.pat_medical_conditions || '',
    pat_allergies: initial.pat_allergies || '',
    pat_blood_type: initial.pat_blood_type || '',
    pat_emergency_contact_name: initial.pat_emergency_contact_name || '',
    pat_emergency_contact_phone: initial.pat_emergency_contact_phone || '',
    pat_state: initial.pat_state ?? true,
    pat_id: initial.pat_id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => {
      if (name === 'pat_state') {
        return { ...f, pat_state: value === 'true' };
      }
      return { ...f, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Solo enviar los campos estrictamente requeridos y no vacíos
    const payload: Partial<PatientDetail> = {};
    (
      [
        'pat_code',
        'pat_medical_conditions',
        'pat_allergies',
        'pat_blood_type',
        'pat_emergency_contact_name',
        'pat_emergency_contact_phone',
        'pat_state',
        'pat_id',
      ] as const
    ).forEach(key => {
      const value = form[key];
      if (
        value !== '' &&
        value !== undefined &&
        !(typeof value === 'string' && value.trim() === '')
      ) {
        // @ts-expect-error: safe assignment for known keys
        payload[key] = value;
      }
    });
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block mb-1'>Código Paciente</label>
        <input
          name='pat_code'
          value={form.pat_code || ''}
          onChange={handleChange}
          className='input'
          required
        />
      </div>
      <div>
        <label className='block mb-1'>Condiciones médicas</label>
        <input
          name='pat_medical_conditions'
          value={form.pat_medical_conditions || ''}
          onChange={handleChange}
          className='input'
        />
      </div>
      <div>
        <label className='block mb-1'>Alergias</label>
        <input
          name='pat_allergies'
          value={form.pat_allergies || ''}
          onChange={handleChange}
          className='input'
        />
      </div>
      <div>
        <label className='block mb-1'>Tipo de sangre</label>
        <input
          name='pat_blood_type'
          value={form.pat_blood_type || ''}
          onChange={handleChange}
          className='input'
        />
      </div>
      <div>
        <label className='block mb-1'>Contacto de emergencia</label>
        <input
          name='pat_emergency_contact_name'
          value={form.pat_emergency_contact_name || ''}
          onChange={handleChange}
          className='input'
        />
      </div>
      <div>
        <label className='block mb-1'>Teléfono de emergencia</label>
        <input
          name='pat_emergency_contact_phone'
          value={form.pat_emergency_contact_phone || ''}
          onChange={handleChange}
          className='input'
        />
      </div>
      <div>
        <label className='block mb-1'>Estado</label>
        <select name='pat_state' value={form.pat_state ? 'true' : 'false'} onChange={handleChange}>
          <option value='true'>Activo</option>
          <option value='false'>Inactivo</option>
        </select>
      </div>
      <div className='flex gap-2'>
        <Button type='submit' disabled={loading}>
          Guardar
        </Button>
        {onCancel && (
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};
