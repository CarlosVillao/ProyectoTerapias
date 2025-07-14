import { useEffect, useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toast } from '@/components/ui/toast';
import { getSessions, createSession, updateSessionStatus } from '@/services/sessionService';
import { getInvoices } from '@/services/adminInvoiceService';
import { getInvoicePayments } from '@/services/adminInvoicePaymentService';
import type { Session, SessionCreate } from '@/services/sessionService';
import type { Invoice } from '@/services/adminInvoiceService';
import type { InvoicePayment } from '@/services/adminInvoicePaymentService';
import { SessionForm } from './SessionForm';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<InvoicePayment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    getSessions().then(res => setSessions(res.data));
    getInvoices().then(setInvoices);
    getInvoicePayments().then(setPayments);
  }, [refresh]);

  const handleEditSession = (session: Session) => {
    setEditSession(session);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: Partial<SessionCreate>) => {
    try {
      if (editSession) {
        await updateSessionStatus(editSession.sec_id, data.consumed ?? false, data.execution_date);
        setToast({ message: 'Sesión actualizada', type: 'success' });
      } else {
        await createSession(data as SessionCreate);
        setToast({ message: 'Sesión creada', type: 'success' });
      }
      setShowForm(false);
      setEditSession(null);
      setRefresh(r => r + 1);
    } catch {
      setToast({ message: 'Error al guardar sesión', type: 'error' });
    }
  };

  return (
    <MainLayout
      breadList={[
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/sessions', label: 'Sesiones' },
      ]}
    >
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold'>Sesiones</h1>
          <Button onClick={() => setShowForm(true)}>Agregar Sesión</Button>
        </div>
        <div style={{ maxWidth: '80vw', overflowX: 'auto' }} className='w-full'>
          <div style={{ minWidth: 1200 }}>
            <Table>
              <TableHeader>
                <TableRow className='bg-muted'>
                  <TableHead>ID</TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Fecha Programada</TableHead>
                  <TableHead>Fecha Ejecución</TableHead>
                  <TableHead>Consumida</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map(session => (
                  <TableRow key={session.sec_id}>
                    <TableCell>{session.sec_id}</TableCell>
                    <TableCell>{session.invoice_id}</TableCell>
                    <TableCell>{session.product_id}</TableCell>
                    <TableCell>{session.scheduled_date}</TableCell>
                    <TableCell>{session.execution_date}</TableCell>
                    <TableCell>{session.consumed ? 'Sí' : 'No'}</TableCell>
                    <TableCell>{session.state ? 'Activa' : 'Inactiva'}</TableCell>
                    <TableCell>
                      {invoices.find(inv => inv.inv_id === session.invoice_id)?.inv_total ?? '-'}
                    </TableCell>
                    <TableCell>
                      {payments.find(pay => pay.inp_invoice_id === session.invoice_id)
                        ?.inp_amount ?? '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEditSession(session)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>{editSession ? 'Editar Sesión' : 'Agregar Sesión'}</DialogTitle>
            </DialogHeader>
            <SessionForm
              initial={editSession ?? undefined}
              invoices={invoices}
              payments={payments}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditSession(null);
              }}
            />
          </DialogContent>
        </Dialog>
        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </MainLayout>
  );
}
