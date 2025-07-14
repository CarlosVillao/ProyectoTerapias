import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { usePatients } from '@/hooks/usePatients';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { PatientForm } from './PatientForm';
import { createPaciente, updatePaciente, deletePaciente } from '@/services/pacientesService';
import { createPerson, updatePerson } from '@/services/adminPersonService';
import { createClient, updateClient } from '@/services/adminClientService';
import type { PatientDetail } from '@/hooks/usePatients';

export default function PatientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editPatient, setEditPatient] = useState<PatientDetail | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PatientDetail | null>(null);
  const [showHistory, setShowHistory] = useState<PatientDetail | null>(null);

  const { patients, error } = usePatients(refresh);

  // CRUD handlers
  const handleCreate = async (data: Partial<PatientDetail>) => {
    try {
      // 1. Crear persona
      const personPayload = {
        per_names: data.per_names || '',
        per_surnames: data.per_surnames || '',
        per_birth_date: data.per_birth_date || '',
        per_genre_id: 1, // Ajustar según lógica real
        per_marital_status_id: data.per_marital_status_id || 1,
        per_country: '', // Ajustar si hay campo
        per_city: '', // Ajustar si hay campo
        per_address: data.per_address || '',
        per_phone: data.per_phone || '',
        per_mail: data.per_mail || '',
        per_identification: '', // Ajustar si hay campo
        per_state: true,
        user_created: '',
        date_created: '',
      };

      const createdPerson = await createPerson(personPayload);

      // 2. Crear cliente
      const clientPayload = {
        cli_person_id: createdPerson.per_id,
        cli_identification: '',
        cli_name: data.per_names || '',
        cli_address_bill: '',
        cli_mail_bill: data.per_mail || '',
        cli_state: true,
        user_created: '',
        date_created: '',
      };

      const createdClient = await createClient(clientPayload);

      // 3. Crear paciente
      const pacientePayload = {
        pat_client_id: createdClient.cli_id,
        pat_code: data.pat_code,
        pat_medical_conditions: data.pat_medical_conditions,
        pat_allergies: data.pat_allergies,
        pat_blood_type: data.pat_blood_type,
        pat_emergency_contact_name: data.pat_emergency_contact_name,
        pat_emergency_contact_phone: data.pat_emergency_contact_phone,
        pat_state: true,
        user_created: '',
        date_created: '',
      };

      await createPaciente(pacientePayload);

      setShowForm(false);
      setToast({ message: 'Paciente creado exitosamente', type: 'success' });
      setRefresh(r => r + 1);
    } catch (error) {
      console.error('Error al crear paciente:', error);
      setToast({ message: 'Error al crear paciente', type: 'error' });
    }
  };

  const handleEdit = async (data: Partial<PatientDetail>) => {
    try {
      // 1. Actualizar persona
      if (data.per_id) {
        const personPayload = {
          per_names: data.per_names || '',
          per_surnames: data.per_surnames || '',
          per_birth_date: data.per_birth_date || '',
          per_genre_id: 1, // Ajustar según lógica real
          per_marital_status_id: data.per_marital_status_id || 1,
          per_country: '',
          per_city: '',
          per_address: data.per_address || '',
          per_phone: data.per_phone || '',
          per_mail: data.per_mail || '',
          per_identification: '',
          per_state: true,
          user_created: '',
          date_created: '',
        };
        await updatePerson(data.per_id, personPayload);
      }

      // 2. Actualizar cliente
      if (data.cli_id) {
        const clientPayload = {
          cli_person_id: data.per_id!,
          cli_identification: '',
          cli_name: data.per_names || '',
          cli_address_bill: '',
          cli_mail_bill: data.per_mail || '',
          cli_state: true,
          user_created: '',
          date_created: '',
        };
        await updateClient(data.cli_id, clientPayload);
      }

      // 3. Actualizar paciente
      if (data.pat_id) {
        const pacientePayload = {
          pat_code: data.pat_code,
          pat_medical_conditions: data.pat_medical_conditions,
          pat_allergies: data.pat_allergies,
          pat_blood_type: data.pat_blood_type,
          pat_state: true,
        };
        await updatePaciente(data.pat_id, pacientePayload);
      }

      setEditPatient(null);
      setShowForm(false);
      setToast({ message: 'Paciente actualizado', type: 'success' });
      setRefresh(r => r + 1);
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      setToast({ message: 'Error al actualizar paciente', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      if (confirmDelete.pat_id !== undefined) {
        await deletePaciente(confirmDelete.pat_id);
      }
      setConfirmDelete(null);
      setToast({ message: 'Paciente eliminado', type: 'success' });
      setRefresh(r => r + 1);
    } catch (error) {
      console.error('Error al eliminar paciente:', error);
      setToast({ message: 'Error al eliminar paciente', type: 'error' });
    }
  };

  const handleAddPatient = () => {
    setEditPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient: PatientDetail) => {
    setEditPatient(patient);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Partial<PatientDetail>) => {
    if (editPatient) {
      await handleEdit({ ...data, pat_id: editPatient.pat_id });
    } else {
      await handleCreate(data);
    }
  };

  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/patients', label: 'Pacientes' },
      ]}
    >
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>Pacientes</h1>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => setRefresh(r => r + 1)}>
              Recargar
            </Button>
            <Button onClick={handleAddPatient}>Agregar Paciente</Button>
          </div>
        </div>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            Error: {error}
          </div>
        )}

        <div style={{ maxWidth: '80vw', overflowX: 'auto' }} className='w-full'>
          <div style={{ minWidth: 1100 }}>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted'>
                  <TableHead>ID</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Condiciones médicas</TableHead>
                  <TableHead>Alergias</TableHead>
                  <TableHead>Tipo de Sangre</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map(patient => (
                  <TableRow key={patient.pat_id}>
                    <TableCell>{patient.pat_id}</TableCell>
                    <TableCell>
                      {patient.per_identification || patient.cli_identification || '-'}
                    </TableCell>
                    <TableCell>{patient.pat_code}</TableCell>
                    <TableCell>{patient.pat_medical_conditions}</TableCell>
                    <TableCell>{patient.pat_allergies}</TableCell>
                    <TableCell>{patient.pat_blood_type}</TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleEditPatient(patient)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant='destructive'
                          size='sm'
                          onClick={() => setConfirmDelete(patient)}
                        >
                          Eliminar
                        </Button>
                        <Button
                          variant='secondary'
                          size='sm'
                          onClick={() => setShowHistory(patient)}
                        >
                          Ver Historial
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Historial Dialog */}
        <Dialog open={!!showHistory} onOpenChange={() => setShowHistory(null)}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Historial Clínico</DialogTitle>
            </DialogHeader>
            {showHistory && (
              <div>
                <h3 className='font-semibold mb-2'>Antecedentes Médicos</h3>
                {showHistory.medical_history?.length ? (
                  <ul className='mb-4'>
                    {showHistory.medical_history.map(hist => (
                      <li key={hist.hist_id} className='mb-2'>
                        <strong>Motivo:</strong> {hist.primary_complaint}
                        <br />
                        <strong>Fecha inicio:</strong> {hist.onset_date}
                        <br />
                        <strong>Trauma relacionado:</strong> {hist.related_trauma ? 'Sí' : 'No'}
                        <br />
                        <strong>Tratamiento actual:</strong> {hist.current_treatment}
                        <br />
                        <strong>Notas:</strong> {hist.notes}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay antecedentes médicos.</p>
                )}
                <h3 className='font-semibold mb-2'>Alergias</h3>
                {showHistory.allergies?.length ? (
                  <ul className='mb-4'>
                    {showHistory.allergies.map(al => (
                      <li key={al.id}>
                        {al.name} {al.description && `- ${al.description}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay alergias registradas.</p>
                )}
                <h3 className='font-semibold mb-2'>Enfermedades</h3>
                {showHistory.diseases?.length ? (
                  <ul>
                    {showHistory.diseases.map(dis => (
                      <li key={dis.id}>
                        {dis.name} {dis.description && `- ${dis.description}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay enfermedades registradas.</p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>{editPatient ? 'Editar Paciente' : 'Agregar Paciente'}</DialogTitle>
            </DialogHeader>
            <PatientForm
              initial={editPatient ?? undefined}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
          <div className='p-6'>
            <h3 className='text-lg font-semibold mb-2'>Confirmar eliminación</h3>
            <p className='text-gray-600 mb-4'>
              ¿Estás seguro de que quieres eliminar este paciente? Esta acción no se puede deshacer.
            </p>
            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={() => setConfirmDelete(null)}>
                Cancelar
              </Button>
              <Button variant='destructive' onClick={handleDelete}>
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>

        {/* Toast notifications */}
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </MainLayout>
  );
}
