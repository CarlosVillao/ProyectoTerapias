import { useState, useEffect } from 'react';
import type { AdminPatient } from '@/hooks/usePatients';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

interface PatientFormProps {
  initial?: Partial<AdminPatient>;
  onSubmit: (data: Partial<AdminPatient>) => void;
  onCancel: () => void;
}

export function PatientForm({ initial = {}, onSubmit, onCancel }: PatientFormProps) {
  const [form, setForm] = useState<Partial<AdminPatient>>({
    pat_id: initial.pat_id ?? 0,
    pat_person_id: initial.pat_person_id ?? 0,
    pat_client_id: initial.pat_client_id ?? 0,
    pat_code: initial.pat_code ?? '',
    pat_medical_conditions: initial.pat_medical_conditions ?? '',
    pat_allergies: initial.pat_allergies ?? '',
    pat_blood_type: initial.pat_blood_type ?? '',
    pat_emergency_contact_name: initial.pat_emergency_contact_name ?? '',
    pat_emergency_contact_phone: initial.pat_emergency_contact_phone ?? '',
    pat_state: initial.pat_state ?? true,
  });

  useEffect(() => {
    setForm({
      pat_id: initial.pat_id ?? 0,
      pat_person_id: initial.pat_person_id ?? 0,
      pat_client_id: initial.pat_client_id ?? 0,
      pat_code: initial.pat_code ?? '',
      pat_medical_conditions: initial.pat_medical_conditions ?? '',
      pat_allergies: initial.pat_allergies ?? '',
      pat_blood_type: initial.pat_blood_type ?? '',
      pat_emergency_contact_name: initial.pat_emergency_contact_name ?? '',
      pat_emergency_contact_phone: initial.pat_emergency_contact_phone ?? '',
      pat_state: initial.pat_state ?? true,
    });
  }, [initial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: string | number | boolean = value;
    if (type === 'number' || name.endsWith('_id')) {
      newValue = value === '' ? 0 : Number(value);
    }
    if (name === 'pat_state') {
      newValue = value === 'true';
    }
    setForm(f => ({
      ...f,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pat_person_id || !form.pat_client_id || !form.pat_code) {
      alert('ID Persona, ID Cliente y Código Paciente son obligatorios');
      return;
    }
    // Solo enviar los campos estrictamente requeridos y no vacíos
    const allowedKeys: (keyof AdminPatient)[] = [
      'pat_person_id',
      'pat_client_id',
      'pat_code',
      'pat_medical_conditions',
      'pat_allergies',
      'pat_blood_type',
      'pat_emergency_contact_name',
      'pat_emergency_contact_phone',
      'pat_state',
      'pat_id',
    ];
    const payload: Partial<AdminPatient> = {};
    allowedKeys.forEach(key => {
      const value = form[key];
      if (
        value !== '' &&
        value !== undefined &&
        !(typeof value === 'string' && value.trim() === '')
      ) {
        // (payload as any)[key] = value;
      }
    });
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <Label>ID Persona</Label>
        <Input
          name='pat_person_id'
          type='number'
          value={form.pat_person_id}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>ID Cliente</Label>
        <Input
          name='pat_client_id'
          type='number'
          value={form.pat_client_id}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label>Código Paciente</Label>
        <Input name='pat_code' value={form.pat_code} onChange={handleChange} required />
      </div>
      <div>
        <Label>Condiciones médicas</Label>
        <Input
          name='pat_medical_conditions'
          value={form.pat_medical_conditions}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Alergias</Label>
        <Input name='pat_allergies' value={form.pat_allergies} onChange={handleChange} />
      </div>
      <div>
        <Label>Tipo de sangre</Label>
        <Input name='pat_blood_type' value={form.pat_blood_type} onChange={handleChange} />
      </div>
      <div>
        <Label>Contacto de emergencia</Label>
        <Input
          name='pat_emergency_contact_name'
          value={form.pat_emergency_contact_name}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Teléfono de emergencia</Label>
        <Input
          name='pat_emergency_contact_phone'
          value={form.pat_emergency_contact_phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Estado</Label>
        <select name='pat_state' value={form.pat_state ? 'true' : 'false'} onChange={handleChange}>
          <option value='true'>Activo</option>
          <option value='false'>Inactivo</option>
        </select>
      </div>
      <div className='flex gap-2'>
        <Button type='submit' className='btn btn-primary'>
          Guardar
        </Button>
        <Button type='button' className='btn btn-secondary' onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
