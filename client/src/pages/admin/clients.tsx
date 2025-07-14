import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { useClients } from '@/hooks/useClients';
import { ClientForm } from '@/components/clients/ClientForm';
import {
  createClient,
  updateClient,
  deleteClient,
  type Client,
} from '@/services/adminClientService';
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

export default function ClientsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Client | null>(null);
  const { clients, loading, error } = useClients(refresh);

  const handleCreate = async (data: Partial<Client>) => {
    try {
      await createClient(data);
      setShowForm(false);
      setToast({ message: 'Cliente creado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al crear cliente', type: 'error' });
    }
  };

  const handleEdit = async (data: Partial<Client>) => {
    if (!editClient) return;
    try {
      await updateClient(editClient.cli_id, data);
      setEditClient(null);
      setToast({ message: 'Cliente actualizado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al actualizar cliente', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteClient(confirmDelete.cli_id);
      setToast({ message: 'Cliente eliminado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al eliminar cliente', type: 'error' });
    }
    setConfirmDelete(null);
  };

  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/clients', label: 'Clientes' },
      ]}
    >
      <h1 className='text-2xl font-bold mb-4'>Clientes</h1>
      <div className='flex gap-2 mb-4'>
        <Button onClick={() => setShowForm(true)} className='bg-green-300 text-white'>
          Nuevo Cliente
        </Button>
        <Button variant='outline' onClick={() => setRefresh(r => r + 1)}>
          Recargar
        </Button>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <h2 className='text-lg font-semibold mb-2'>Nuevo Cliente</h2>
        <ClientForm onSubmit={handleCreate} loading={loading} />
      </Modal>

      <Modal open={!!editClient} onClose={() => setEditClient(null)}>
        <h2 className='text-lg font-semibold mb-2'>Editar Cliente</h2>
        <ClientForm initial={editClient ?? {}} onSubmit={handleEdit} loading={loading} />
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div className='text-center'>
          <p>
            ¿Seguro que deseas eliminar el cliente <b>{confirmDelete?.cli_name}</b>?
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

      {loading && <div>Cargando clientes...</div>}
      {error && <div className='text-red-500'>{error}</div>}
      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow className='bg-muted'>
              <TableHead>ID</TableHead>
              <TableHead>Identificación</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Dirección Facturación</TableHead>
              <TableHead>Email Facturación</TableHead>
              <TableHead>Activo</TableHead>
              <TableHead>Creado</TableHead>
              <TableHead>Modificado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client: Client) => (
              <TableRow key={client.cli_id}>
                <TableCell>{client.cli_id}</TableCell>
                <TableCell>{client.cli_identification}</TableCell>
                <TableCell>{client.cli_name}</TableCell>
                <TableCell>{client.cli_address_bill}</TableCell>
                <TableCell>{client.cli_mail_bill}</TableCell>
                <TableCell>
                  <Badge color={client.cli_state ? 'success' : 'danger'}>
                    {client.cli_state ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.date_created ? new Date(client.date_created).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  {client.date_modified ? new Date(client.date_modified).toLocaleString() : '-'}
                </TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Button size='sm' variant='outline' onClick={() => setEditClient(client)}>
                      Editar
                    </Button>
                    <Button
                      size='sm'
                      variant='destructive'
                      onClick={() => setConfirmDelete(client)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </MainLayout>
  );
}
