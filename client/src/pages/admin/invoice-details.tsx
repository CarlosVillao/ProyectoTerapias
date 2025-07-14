import MainLayout from '@/layouts/MainLayout';
import { useState } from 'react';
import { useInvoiceDetails } from '@/hooks/useInvoiceDetails';
import { InvoiceDetailForm } from '@/components/invoice-details/InvoiceDetailForm';
import {
  createInvoiceDetail,
  updateInvoiceDetail,
  deleteInvoiceDetail,
  type InvoiceDetail,
} from '@/services/adminInvoiceDetailService';
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

export default function InvoiceDetailsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editDetail, setEditDetail] = useState<InvoiceDetail | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<InvoiceDetail | null>(null);
  const { invoiceDetails, loading, error } = useInvoiceDetails(refresh);

  const handleCreate = async (data: Partial<InvoiceDetail>) => {
    try {
      await createInvoiceDetail(data);
      setShowForm(false);
      setToast({ message: 'Detalle creado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al crear detalle', type: 'error' });
    }
  };

  const handleEdit = async (data: Partial<InvoiceDetail>) => {
    if (!editDetail) return;
    try {
      await updateInvoiceDetail(editDetail.ind_id, data);
      setEditDetail(null);
      setToast({ message: 'Detalle actualizado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al actualizar detalle', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteInvoiceDetail(confirmDelete.ind_id);
      setToast({ message: 'Detalle eliminado', type: 'success' });
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al eliminar detalle', type: 'error' });
    }
    setConfirmDelete(null);
  };

  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/invoice-details', label: 'Detalles de Factura' },
      ]}
    >
      <h1 className='text-2xl font-bold mb-4'>Detalles de Factura</h1>
      <div className='flex gap-2 mb-4'>
        <Button onClick={() => setShowForm(true)} className='bg-primary text-white'>
          Nuevo Detalle
        </Button>
        <Button variant='outline' onClick={() => setRefresh(r => r + 1)}>
          Recargar
        </Button>
      </div>
      <Modal open={showForm} onClose={() => setShowForm(false)}>
        <h2 className='text-lg font-semibold mb-2'>Nuevo Detalle</h2>
        <InvoiceDetailForm onSubmit={handleCreate} loading={loading} />
      </Modal>
      <Modal open={!!editDetail} onClose={() => setEditDetail(null)}>
        <h2 className='text-lg font-semibold mb-2'>Editar Detalle</h2>
        <InvoiceDetailForm initial={editDetail ?? {}} onSubmit={handleEdit} loading={loading} />
      </Modal>
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div className='text-center'>
          <p>
            ¿Seguro que deseas eliminar el detalle <b>{confirmDelete?.ind_id}</b>?
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
      {loading && <div>Cargando detalles...</div>}
      {error && <div className='text-red-500'>{error}</div>}
      {!loading && !error && (
        <div style={{ maxWidth: '80vw', overflowX: 'auto' }} className='w-full'>
          <div style={{ minWidth: 900 }}>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted'>
                  <TableHead>ID</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceDetails.map((detail: InvoiceDetail) => (
                  <TableRow key={detail.ind_id}>
                    <TableCell>{detail.ind_id}</TableCell>
                    <TableCell>{detail.ind_invoice_id}</TableCell>
                    <TableCell>{detail.ind_product_id}</TableCell>
                    <TableCell>{detail.ind_quantity}</TableCell>
                    <TableCell>{detail.ind_unit_price}</TableCell>
                    <TableCell>{detail.ind_total}</TableCell>
                    <TableCell>{detail.ind_state ? 'Activo' : 'Inactivo'}</TableCell>
                    <TableCell>
                      {detail.date_created ? new Date(detail.date_created).toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        <Button size='sm' variant='outline' onClick={() => setEditDetail(detail)}>
                          Editar
                        </Button>
                        <Button
                          size='sm'
                          variant='destructive'
                          onClick={() => setConfirmDelete(detail)}
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
