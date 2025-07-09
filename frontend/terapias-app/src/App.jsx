import './index.css';
import React, { useState, useEffect } from 'react';
import LoginForm from './components/auth/LoginForm';
import SeleccionRol from './components/auth/SeleccionRol';
import SidebarMenu from './components/layout/SidebarMenu';
import Navbar from './components/layout/Navbar';

function App() {
  const [token, setToken] = useState(null);
  const [loginId, setLoginId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [rolId, setRolId] = useState(null);
  const [rolName, setRolName] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedLoginId = localStorage.getItem('login_id');
    const storedRolId = localStorage.getItem('rol_id');
    const storedUserId = localStorage.getItem('user_id');

    if (storedToken && storedLoginId && storedRolId && storedUserId) {
      setToken(storedToken);
      setLoginId(storedLoginId);
      setRolId(parseInt(storedRolId));
      setUserId(parseInt(storedUserId));
    }
  }, []);

  const handleLogin = (user_id, roles) => {
    setUserId(user_id);
    setRoles(roles);
    localStorage.setItem('user_id', user_id);
  };

  const handleRolSeleccionado = (token, login_id, rol_id) => {
    localStorage.setItem('token', token);
    localStorage.setItem('login_id', login_id);
    localStorage.setItem('rol_id', rol_id);

    setToken(token);
    setLoginId(login_id);
    setRolId(rol_id);
  };

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setLoginId(null);
    setUserId(null);
    setRoles([]);
    setRolId(null);
    setRolName('');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {!token ? (
        !userId ? (
          <div className="flex-grow flex items-center justify-center">
            <LoginForm onLogin={handleLogin} />
          </div>
        ) : (
          <SeleccionRol
            userId={userId}
            roles={roles}
            onRolSeleccionado={handleRolSeleccionado}
          />
        )
      ) : (
        <div className="flex flex-row min-h-screen">
          <SidebarMenu />
          <div className="flex flex-col flex-1">
            <Navbar rolName={rolName} onLogout={handleLogout} />
            <main className="flex-grow p-6">
              <h2 className="text-2xl font-bold mb-4">Bienvenido al sistema</h2>
              <p className="mb-2">Login ID: {loginId}</p>
              <p className="mb-2">User ID: {userId}</p>
              <p className="mb-2">Rol ID: {rolId}</p>
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
