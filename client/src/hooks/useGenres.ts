import { useEffect, useState } from 'react';
import { getGenres, type Genre } from '@/services/adminGenreService';

export function useGenres(refresh = 0) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getGenres()
      .then(setGenres)
      .catch(() => setError('Error al cargar géneros'))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { genres, loading, error };
}
