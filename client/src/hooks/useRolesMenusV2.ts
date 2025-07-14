import { useEffect, useState } from 'react';

export interface RoleMenuV2 {
  rol_name: string;
  menus: Array<{
    menu_id: number;
    menu_name: string;
    menu_icon_name?: string;
    menu_url?: string;
    menu_order?: number;
    // Agrega aquí otros campos conocidos si los necesitas
  }>;
}

export function useRolesMenusV2() {
  const [roles, setRoles] = useState<RoleMenuV2[]>([]);
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
        // Si es un array, usarlo. Si es objeto único, envolver en array
        if (Array.isArray(data)) setRoles(data);
        else if (data && data.rol_name && data.menus) setRoles([data]);
        else setRoles([]);
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
