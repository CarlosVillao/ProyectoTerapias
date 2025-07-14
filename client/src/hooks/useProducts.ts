import { useEffect, useState } from 'react';
import { getProducts, type Product } from '@/services/adminProductService';

export function useProducts(refresh = 0) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProducts()
      .then(setProducts)
      .catch(() => setError('Error al cargar productos'))
      .finally(() => setLoading(false));
  }, [refresh]);

  return { products, loading, error };
}
