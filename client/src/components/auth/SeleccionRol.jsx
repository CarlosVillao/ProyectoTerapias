import React, { useState } from "react";

const SeleccionRol = ({ userId, roles, onRolSeleccionado }) => {
  const [rolId, setRolId] = useState("");
  const [error, setError] = useState("");

  const handleSeleccion = async (e) => {
    e.preventDefault();
    setError("");

    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

    if (!userId || !rolId) {
      setError("Faltan datos para seleccionar el rol");
      return;
    }

    try {
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

      const response = await fetch(`${API_BASE}/auth/seleccionar-rol`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, rol_id: parseInt(rolId) }),
      });
      

      if (!response.ok) throw new Error("No se pudo seleccionar el rol");
      const data = await response.json();

      localStorage.setItem("rol_id", rolId);
      onRolSeleccionado(data.token, data.login_id);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al seleccionar el rol");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSeleccion} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Seleccionar Rol</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Rol disponible</label>
          <select
            value={rolId}
            onChange={(e) => setRolId(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">-- Selecciona un rol --</option>
            {roles.map((rol) => (
              <option key={rol.rol_id} value={rol.rol_id}>
                {rol.rol_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Continuar
        </button>
      </form>
    </div>
  );
};

export default SeleccionRol;