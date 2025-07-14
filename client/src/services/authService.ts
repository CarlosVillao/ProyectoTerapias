import axios, { AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_SECURITY_SERVICE_URL || 'http://localhost:8002';

// Tipos para usuario y respuesta de autenticación
export interface AuthUser {
  id: number;
  email: string;
  // agrega más campos según tu backend
}

export interface Role {
  id: number;
  name: string;
  // agrega más campos según tu backend
}

export interface AuthResponse {
  token: string;
  user_id: number;
  rol_id: number;
  login_id: number;
  message: string;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await axios.post(
      `${apiUrl}/auth/login`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data;
  } catch (error: unknown) {
    const err = error as AxiosError;
    const data = err.response?.data;
    // Type guard para detail
    const hasDetail = (d: unknown): d is { detail: string | { msg: string }[] } =>
      typeof d === 'object' && d !== null && 'detail' in d;
    if (err.response && hasDetail(data)) {
      if (
        err.response.status === 422 &&
        Array.isArray(data.detail) &&
        data.detail.length > 0 &&
        'msg' in data.detail[0]
      ) {
        throw new Error('Error de validación: ' + data.detail[0].msg);
      }
      if (typeof data.detail === 'string') {
        throw new Error(data.detail);
      }
      throw new Error('Error de validación en los campos enviados.');
    }
    throw error;
  }
}

export async function logoutRequest(): Promise<void> {
  const token = localStorage.getItem('token');
  if (token) {
    await axios.post(
      `${apiUrl}/auth/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    );
  }
}

export interface RecuperarPasswordResponse {
  message: string;
}

export async function recuperarPasswordRequest(email: string): Promise<RecuperarPasswordResponse> {
  const response = await axios.post<RecuperarPasswordResponse>(
    `${apiUrl}/auth/recuperar-password`,
    { email },
  );
  return response.data;
}

export interface ResetearPasswordResponse {
  message: string;
}

export async function resetearPasswordRequest(
  email: string,
  token: string,
  new_password: string,
): Promise<ResetearPasswordResponse> {
  const response = await axios.post<ResetearPasswordResponse>(`${apiUrl}/auth/resetear-password`, {
    email,
    token,
    new_password,
  });
  return response.data;
}

export interface CambiarPasswordResponse {
  message: string;
}

export async function cambiarPasswordRequest(
  user_id: number,
  old_password: string,
  new_password: string,
): Promise<CambiarPasswordResponse> {
  const response = await axios.post<CambiarPasswordResponse>(`${apiUrl}/auth/cambiar-password`, {
    user_id,
    old_password,
    new_password,
  });
  return response.data;
}

export interface SeleccionarRolResponse {
  message: string;
  roles?: Role[];
}

export async function seleccionarRolRequest(
  user_id: number,
  rol_id: number,
): Promise<SeleccionarRolResponse> {
  const response = await axios.post<SeleccionarRolResponse>(`${apiUrl}/auth/seleccionar-rol`, {
    user_id,
    rol_id,
  });
  return response.data;
}

export interface CambiarRolActivoResponse {
  message: string;
}

export async function cambiarRolActivoRequest(
  login_id: number,
  user_id: number,
  new_rol_id: number,
): Promise<CambiarRolActivoResponse> {
  const response = await axios.post<CambiarRolActivoResponse>(`${apiUrl}/auth/cambiar-rol-activo`, {
    login_id,
    user_id,
    new_rol_id,
  });
  return response.data;
}

export interface ValidateTokenResponse {
  user: AuthUser;
  roles?: Role[];
  message?: string;
}

export async function validateTokenRequest(token: string): Promise<ValidateTokenResponse> {
  const response = await axios.post<ValidateTokenResponse>(`${apiUrl}/auth/validate-token`, {
    token,
  });
  return response.data;
}
