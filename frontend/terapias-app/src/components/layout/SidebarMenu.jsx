/*import React, { useEffect, useState } from "react";
import axios from "axios";

console.log("Ingresando a Sidebar");

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,               // permite cookies/credenciales CORS
  headers: {
    "Content-Type": "application/json"
  },
});

const SidebarMenu = () => {
  const [menus, setMenus] = useState([]);
  const [rolName, setRolName] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ Token no disponible. El usuario no está autenticado.");
        return;
      }

      try {
        console.log("Token:", token);
        const response = await api.get("/menus/por-rol", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;
        console.log("Datos recibidos:", data);

        if (data && Array.isArray(data.menus)) {
          console.log("Si hay datos");
          setMenus(data.menus);
          setRolName(data.rol_name || "");
        } else if (Array.isArray(data)) {
          console.log("Solo lista sin objeto");
          setMenus(data);
        } else {
          console.warn("⚠️ Respuesta inesperada al obtener menús:", data);
        }
      } catch (error) {
        console.error("❌ Error al cargar menú del sidebar:", error);
      }
    };

    fetchMenus();
  }, []);

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4 border-r">
      <h2 className="text-lg font-bold mb-2">Menú</h2>

      {rolName && (
        <p className="text-sm text-gray-600 mb-4">
          Rol activo: <strong>{rolName}</strong>
        </p>
      )}

      <ul className="space-y-2">
        {menus.length === 0 ? (
          <li className="text-gray-500 text-sm">No hay menús disponibles</li>
        ) : (
          menus.map((menu) => (
            <li key={menu.menu_id}>
              <a
                href={menu.menu_url || "#"}
                className="flex items-center px-3 py-2 rounded hover:bg-blue-100 text-gray-700"
              >
                {menu.menu_icon_name && (
                  <i className={`mr-2 ${menu.menu_icon_name}`}></i>
                )}
                <span>{menu.menu_name}</span>
              </a>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default SidebarMenu;*/

import React, { useEffect, useState } from "react";
import axios from "axios";

console.log("Ingresando a Sidebar");

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,               // permite cookies/credenciales CORS
  headers: {
    "Content-Type": "application/json"
  },
});

const SidebarMenu = () => {
  const [menus, setMenus] = useState([]);
  const [rolName, setRolName] = useState("");

  useEffect(() => {
    const fetchMenus = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ Token no disponible. El usuario no está autenticado.");
        return;
      }

      try {
        console.log("Token:", token);
        const response = await api.get("/menus/por-rol", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;
        console.log("Datos recibidos:", data);

        if (data && Array.isArray(data.menus)) {
          console.log("Si hay datos");
          setMenus(data.menus);
          setRolName(data.rol_name || "");

          // ───────────────────────────────────────────────
          // Guardamos rol_name para que otros componentes (p.ej. NavBar)
          // puedan leerlo desde localStorage
          if (data.rol_name) {
            localStorage.setItem("rolName", data.rol_name);
          }
          // ───────────────────────────────────────────────

        } else if (Array.isArray(data)) {
          console.log("Solo lista sin objeto");
          setMenus(data);
        } else {
          console.warn("⚠️ Respuesta inesperada al obtener menús:", data);
        }
      } catch (error) {
        console.error("❌ Error al cargar menú del sidebar:", error);
      }
    };

    fetchMenus();
  }, []);

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4 border-r">
      <h2 className="text-lg font-bold mb-2">Menú</h2>

      {rolName && (
        <p className="text-sm text-gray-600 mb-4">
          Rol activo: <strong>{rolName}</strong>
        </p>
      )}

      <ul className="space-y-2">
        {menus.length === 0 ? (
          <li className="text-gray-500 text-sm">No hay menús disponibles</li>
        ) : (
          menus.map((menu) => (
            <li key={menu.menu_id}>
              <a
                href={menu.menu_url || "#"}
                className="flex items-center px-3 py-2 rounded hover:bg-blue-100 text-gray-700"
              >
                {menu.menu_icon_name && (
                  <i className={`mr-2 ${menu.menu_icon_name}`}></i>
                )}
                <span>{menu.menu_name}</span>
              </a>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default SidebarMenu;

