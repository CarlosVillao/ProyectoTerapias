import { useState, useEffect, type ReactNode } from 'react';
import { loginRequest, logoutRequest } from '@/services/authService';
import type { AuthResponse } from '@/services/authService';
import type { AuthUser } from '@/services/authService';
import { AuthContext } from './AuthContextValue';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Cambio: inicializar como true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch (e) {
            console.warn(
              'Valor corrupto en localStorage["user"]: no es JSON válido. Se limpia automáticamente.',
            );
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
            localStorage.removeItem('token'); // También limpiar token
          }
        } else {
          // Si no hay token o user, asegurarse de que el estado esté limpio
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error inicializando autenticación:', error);
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // Cambio: establecer loading como false al final
      }
    };

    initializeAuth();
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const data: AuthResponse = await loginRequest(email, password);

      setToken(data.token);
      setUser({ id: data.user_id, email });
      setIsAuthenticated(true);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.user_id, email }));
    } catch (err) {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      if (err instanceof Error) setError(err.message);
      else setError('Error de autenticación');

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    logoutRequest();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
