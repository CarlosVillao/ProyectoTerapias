import { useEffect, useState } from 'react';
import { getClients } from '@/services/adminClientService';
import type { Client } from '@/services/adminClientService';

export function useClients(refresh?: number) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getClients()
      .then(setClients)
      .catch((err: unknown) => {
        if (typeof err === 'object' && err && 'message' in err) {
          setError((err as Error).message || 'Error al cargar clientes');
        } else {
          setError('Error al cargar clientes');
        }
      })
      .finally(() => setLoading(false));
  }, [refresh]);

  return { clients, loading, error };
}
