import { useEffect, useState } from 'react';
import { getInvoiceDetails, type InvoiceDetail } from '@/services/adminInvoiceDetailService';

export function useInvoiceDetails(refresh = 0) {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getInvoiceDetails()
      .then(data => {
        setInvoiceDetails(data);
        setError(null);
      })
      .catch(() => setError('Error al cargar detalles de factura'))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { invoiceDetails, loading, error };
}
