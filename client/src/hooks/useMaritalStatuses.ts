import { useEffect, useState } from 'react';
import { getMaritalStatuses, type MaritalStatus } from '@/services/adminMaritalStatusService';

export function useMaritalStatuses(refresh = 0) {
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMaritalStatuses()
      .then(setMaritalStatuses)
      .catch(() => setError('Error al cargar estados civiles'))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { maritalStatuses, loading, error };
}
