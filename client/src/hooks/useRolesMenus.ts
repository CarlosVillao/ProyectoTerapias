import { useEffect, useState } from 'react';

export interface RoleMenu {
  id: number;
  name: string;
  menus: { id: number; name: string; url: string }[];
}

export function useRolesMenus() {
  const [roles, setRoles] = useState<RoleMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8002/menus/por-rol', {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
        });
        if (!res.ok) throw new Error('Error al obtener roles/menús');
        const data = await res.json();
        setRoles(Array.isArray(data) ? data : []);
      } catch {
        setError('Error al cargar roles/menús');
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  return { roles, loading, error };
}
