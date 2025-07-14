import { useEffect, useState } from 'react';
import { getInvoicePayments, type InvoicePayment } from '@/services/adminInvoicePaymentService';

export function useInvoicePayments(refresh = 0) {
  const [invoicePayments, setInvoicePayments] = useState<InvoicePayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getInvoicePayments()
      .then(setInvoicePayments)
      .catch(() => setError('Error al cargar pagos'))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { invoicePayments, loading, error };
}
