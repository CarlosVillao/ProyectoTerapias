import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { useInvoicePayments } from '@/hooks/useInvoicePayments';
import { InvoicePaymentForm } from '@/components/invoice-payments/InvoicePaymentForm';
import {
  createInvoicePayment,
  updateInvoicePayment,
  deleteInvoicePayment,
  type InvoicePayment,
} from '@/services/adminInvoicePaymentService';
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

export default function InvoicePaymentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editPayment, setEditPayment] = useState<InvoicePayment | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<InvoicePayment | null>(null);
  const { invoicePayments, error } = useInvoicePayments(refresh);

  const handleCreate = async (data: Partial<InvoicePayment>) => {
    try {
      await createInvoicePayment(data);
      setShowForm(false);
      setToast({ message: 'Pago creado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al crear pago', type: 'error' });
    }
  };

  const handleEdit = async (data: Partial<InvoicePayment>) => {
    if (!editPayment) return;
    try {
      await updateInvoicePayment(editPayment.inp_id, data);
      setEditPayment(null);
      setToast({ message: 'Pago actualizado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al actualizar pago', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteInvoicePayment(confirmDelete.inp_id);
      setConfirmDelete(null);
      setToast({ message: 'Pago eliminado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al eliminar pago', type: 'error' });
    }
  };

  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/invoice-payments', label: 'Pagos de Factura' },
      ]}
    >
      <h1 className='text-2xl font-bold'>Pagos de Factura</h1>
      <Button onClick={() => setShowForm(true)}>Nuevo Pago</Button>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {error && <div className='text-red-500'>{error}</div>}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>ID Factura</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoicePayments.map(payment => (
            <TableRow key={payment.inp_id}>
              <TableCell>{payment.inp_id}</TableCell>
              <TableCell>{payment.inp_invoice_id}</TableCell>
              <TableCell>{payment.inp_amount}</TableCell>
              <TableCell>{payment.inp_state ? 'Activo' : 'Inactivo'}</TableCell>
              <TableCell>
                <Button size='sm' onClick={() => setEditPayment(payment)}>
                  Editar
                </Button>
                <Button size='sm' variant='destructive' onClick={() => setConfirmDelete(payment)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={showForm || !!editPayment}
        onClose={() => {
          setShowForm(false);
          setEditPayment(null);
        }}
      >
        <InvoicePaymentForm
          initial={editPayment || undefined}
          onSubmit={editPayment ? handleEdit : handleCreate}
          onCancel={() => {
            setShowForm(false);
            setEditPayment(null);
          }}
        />
      </Modal>
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div>
          <p>¿Seguro que deseas eliminar este pago?</p>
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
