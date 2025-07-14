import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { usePersons } from '@/hooks/usePersons';
import { useGenres } from '@/hooks/useGenres';
import { useMaritalStatuses } from '@/hooks/useMaritalStatuses';
import { PersonForm } from '@/components/persons/PersonForm';
import {
  createPerson,
  updatePerson,
  deletePerson,
  type Person,
} from '@/services/adminPersonService';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export default function PersonsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Person | null>(null);
  const { persons, loading, error } = usePersons(refresh);
  const { genres } = useGenres();
  const { maritalStatuses } = useMaritalStatuses();

  const handleCreate = async (data: Partial<Person>) => {
    try {
      await createPerson(data);
      setShowForm(false);
      setToast({ message: 'Persona creada', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al crear persona', type: 'error' });
    }
  };

  const handleEdit = async (data: Partial<Person>) => {
    if (!editPerson) return;
    try {
      await updatePerson(editPerson.per_id!, data);
      setEditPerson(null);
      setToast({ message: 'Persona actualizada', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al actualizar persona', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deletePerson(confirmDelete.per_id!);
      setToast({ message: 'Persona eliminada', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al eliminar persona', type: 'error' });
    }
    setConfirmDelete(null);
  };

  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/persons', label: 'Personas' },
      ]}
    >
      <h1 className='text-2xl font-bold mb-4'>Personas</h1>
      <div className='flex gap-2 mb-4'>
        <Button
          onClick={() => setShowForm(true)}
          className='bg-green-300 dark:bg-green-600 text-foreground'
        >
          Nueva Persona
        </Button>
        <Button variant='outline' onClick={() => setRefresh(r => r + 1)}>
          Recargar
        </Button>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <h2 className='text-lg font-semibold mb-2'>Nueva Persona</h2>
        <PersonForm onSubmit={handleCreate} loading={loading} />
      </Modal>

      <Modal open={!!editPerson} onClose={() => setEditPerson(null)}>
        <h2 className='text-lg font-semibold mb-2'>Editar Persona</h2>
        <PersonForm initial={editPerson ?? {}} onSubmit={handleEdit} loading={loading} />
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div className='text-center'>
          <p>
            ¿Seguro que deseas eliminar la persona{' '}
            <b>
              {confirmDelete?.per_names} {confirmDelete?.per_surnames}
            </b>
            ?
          </p>
          <div className='flex gap-2 justify-center mt-4'>
            <Button onClick={handleDelete} className='bg-red-600 text-white'>
              Eliminar
            </Button>
            <Button variant='outline' onClick={() => setConfirmDelete(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {loading && <div>Cargando personas...</div>}
      {error && <div className='text-red-500'>{error}</div>}
      {!loading && !error && (
        <div style={{ maxWidth: '80vw', overflowX: 'auto' }} className='w-full'>
          <div style={{ minWidth: 1200 }}>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted'>
                  <TableHead>ID</TableHead>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Nombres</TableHead>
                  <TableHead>Apellidos</TableHead>
                  <TableHead>Género</TableHead>
                  <TableHead>Estado Civil</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Fecha Nacimiento</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Modificado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {persons.map((person: Person) => (
                  <TableRow key={person.per_id}>
                    <TableCell>{person.per_id}</TableCell>
                    <TableCell>{person.per_identification}</TableCell>
                    <TableCell>{person.per_names}</TableCell>
                    <TableCell>{person.per_surnames}</TableCell>
                    <TableCell>
                      {genres && genres.length
                        ? (() => {
                            const genre = genres.find(g => g.gen_id === person.per_genre_id);
                            return genre ? (
                              <Badge color='default'>{genre.gen_name}</Badge>
                            ) : (
                              person.per_genre_id
                            );
                          })()
                        : person.per_genre_id}
                    </TableCell>
                    <TableCell>
                      {maritalStatuses && maritalStatuses.length
                        ? (() => {
                            const ms = maritalStatuses.find(
                              m => m.mst_id === person.per_marital_status_id,
                            );
                            return ms ? (
                              <Badge color='default'>{ms.mst_name}</Badge>
                            ) : (
                              person.per_marital_status_id
                            );
                          })()
                        : person.per_marital_status_id}
                    </TableCell>
                    <TableCell>{person.per_country}</TableCell>
                    <TableCell>{person.per_city}</TableCell>
                    <TableCell>{person.per_address}</TableCell>
                    <TableCell>{person.per_phone}</TableCell>
                    <TableCell>{person.per_mail}</TableCell>
                    <TableCell>
                      {person.per_birth_date
                        ? new Date(person.per_birth_date).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge color={person.per_state ? 'success' : 'danger'}>
                        {person.per_state ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {person.date_created ? new Date(person.date_created).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      {person.date_modified ? new Date(person.date_modified).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' onClick={() => setEditPerson(person)}>
                          Editar
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => setConfirmDelete(person)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
