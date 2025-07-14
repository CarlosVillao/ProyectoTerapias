import { useEffect, useState } from 'react';
import { getInvoices, type Invoice } from '@/services/adminInvoiceService';

export function useInvoices(refresh = 0) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getInvoices()
      .then(setInvoices)
      .catch(() => setError('Error al cargar facturas'))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { invoices, loading, error };
}
