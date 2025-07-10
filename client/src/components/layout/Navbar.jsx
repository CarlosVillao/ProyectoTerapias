/*import React from "react";

const Navbar = ({ rolName, onLogout }) => {
  return (
    <header className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-semibold">Sistema ServiHealth</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Rol: <strong>{rolName}</strong>
        </span>
        <button
          onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-white text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;*/

import React, { useState, useEffect } from "react";

const Navbar = ({ onLogout }) => {
  const [rolName, setRolName] = useState("");

  useEffect(() => {
    // Al montar, leemos el rol almacenado por el Sidebar
    const storedRol = localStorage.getItem("rolName");
    if (storedRol) {
      setRolName(storedRol);
    }
  }, []);

  return (
    <header className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <h1 className="text-xl font-semibold">Sistema ServiHealth</h1>
      <div className="flex items-center gap-4">
        {rolName && (
          <span className="text-sm">
            Rol: <strong>{rolName}</strong>
          </span>
        )}
        <button
          onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 text-white text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;

