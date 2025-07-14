import { useEffect, useState } from 'react';
import { getPersons, type Person } from '@/services/adminPersonService';

export function usePersons(refresh = 0) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPersons()
      .then(setPersons)
      .catch(() => setError('Error al cargar personas'))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { persons, loading, error };
}
