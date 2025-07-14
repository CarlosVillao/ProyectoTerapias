import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';
import { InvoiceForm } from '@/components/invoices/InvoiceForm';
import {
  createInvoice,
  updateInvoice,
  deleteInvoice,
  type Invoice,
} from '@/services/adminInvoiceService';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { Toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

export default function InvoicesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Invoice | null>(null);
  const { invoices, error } = useInvoices(refresh);

  const handleCreate = async (data: Partial<Invoice>) => {
    try {
      await createInvoice(data);
      setShowForm(false);
      setToast({ message: 'Factura creada', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al crear factura', type: 'error' });
    }
  };

  const handleEdit = async (data: Partial<Invoice>) => {
    if (!editInvoice) return;
    try {
      await updateInvoice(editInvoice.inv_id, data);
      setEditInvoice(null);
      setToast({ message: 'Factura actualizada', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al actualizar factura', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteInvoice(confirmDelete.inv_id);
      setConfirmDelete(null);
      setToast({ message: 'Factura eliminada', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al eliminar factura', type: 'error' });
    }
  };

  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/invoices', label: 'Facturas' },
      ]}
    >
      <h1 className='text-2xl font-bold'>Facturas</h1>
      <Button className='bg-green-300 text-foreground' onClick={() => setShowForm(true)}>
        Nueva Factura
      </Button>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {error && <div className='text-red-500'>{error}</div>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>ID Paciente</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow key={invoice.inv_id}>
              <TableCell>{invoice.inv_id}</TableCell>
              <TableCell>{invoice.inv_patient_id}</TableCell>
              <TableCell>{invoice.inv_total}</TableCell>
              <TableCell>{invoice.inv_state ? 'Activo' : 'Inactivo'}</TableCell>
              <TableCell>
                <Button size='sm' onClick={() => setEditInvoice(invoice)}>
                  Editar
                </Button>
                <Button size='sm' variant='destructive' onClick={() => setConfirmDelete(invoice)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={showForm || !!editInvoice}
        onClose={() => {
          setShowForm(false);
          setEditInvoice(null);
        }}
      >
        <InvoiceForm
          initial={editInvoice || undefined}
          onSubmit={editInvoice ? handleEdit : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditInvoice(null);
          }}
        />
      </Modal>
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div>
          <p>¿Seguro que deseas eliminar esta factura?</p>
          <div className='flex gap-2 mt-4'>
            <Button variant='destructive' onClick={handleDelete}>
              Eliminar
            </Button>
            <Button onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}
