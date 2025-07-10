import React, { useState } from "react";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Respuesta inválida del servidor");

      const data = await response.json();

      // Se espera que la respuesta tenga user_id y roles
      if (!data.user_id || !data.roles) {
        throw new Error("Respuesta incompleta del servidor");
      }

      onLogin(data.user_id, data.roles);
    } catch (err) {
      console.error("Error de login:", err);
      setError(err.message || "Error de conexión con el servidor");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1">Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="usuario@ejemplo.com"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
