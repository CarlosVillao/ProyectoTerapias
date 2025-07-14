import axios from 'axios';
import type { PatientDetail } from '@/hooks/usePatients';

const apiUrl = import.meta.env.VITE_PACIENTES_SERVICE_URL || 'http://localhost:8001';

// Tipos para paciente
export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fecha_nacimiento?: string;
  direccion?: string;
  // Agrega más campos según tu modelo
}

// Pacientes
export const getPacientes = async () => axios.get<Paciente[]>(`${apiUrl}/pacientes`);
export const createPaciente = async (data: Partial<PatientDetail>) =>
  axios.post(`${apiUrl}/patients/`, data);
export const updatePaciente = async (id: number, data: Partial<PatientDetail>) =>
  axios.put(`${apiUrl}/patients/${id}`, data);
export const deletePaciente = async (id: number) => axios.delete(`${apiUrl}/patients/${id}`);
