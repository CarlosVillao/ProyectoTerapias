import { useEffect, useState } from 'react';
import { getPaymentMethods, type PaymentMethod } from '@/services/adminPaymentMethodService';

export function usePaymentMethods(refresh = 0) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPaymentMethods()
      .then(setPaymentMethods)
      .catch(() => setError('Error al cargar métodos de pago'))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { paymentMethods, loading, error };
}
