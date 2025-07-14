import axios from 'axios';

const apiUrl = import.meta.env.VITE_ADMINISTRACION_SERVICE_URL || 'http://localhost:8000';

// Tipos para Cliente, Producto y Factura
export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  // Agrega más campos según tu modelo
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  // Agrega más campos según tu modelo
}

export interface Factura {
  id: number;
  cliente_id: number;
  fecha: string;
  total: number;
  // Agrega más campos según tu modelo
}

// Clientes
export const getClientes = async () => axios.get<Cliente[]>(`${apiUrl}/clientes`);
export const createCliente = async (data: Omit<Cliente, 'id'>) =>
  axios.post<Cliente>(`${apiUrl}/clientes`, data);
export const updateCliente = async (id: number, data: Partial<Omit<Cliente, 'id'>>) =>
  axios.put<Cliente>(`${apiUrl}/clientes/${id}`, data);
export const deleteCliente = async (id: number) => axios.delete(`${apiUrl}/clientes/${id}`);

// Productos
export const getProductos = async () => axios.get<Producto[]>(`${apiUrl}/productos`);
export const createProducto = async (data: Omit<Producto, 'id'>) =>
  axios.post<Producto>(`${apiUrl}/productos`, data);
export const updateProducto = async (id: number, data: Partial<Omit<Producto, 'id'>>) =>
  axios.put<Producto>(`${apiUrl}/productos/${id}`, data);
export const deleteProducto = async (id: number) => axios.delete(`${apiUrl}/productos/${id}`);

// Facturas
export const getFacturas = async () => axios.get<Factura[]>(`${apiUrl}/facturas`);
export const createFactura = async (data: Omit<Factura, 'id'>) =>
  axios.post<Factura>(`${apiUrl}/facturas`, data);
export const updateFactura = async (id: number, data: Partial<Omit<Factura, 'id'>>) =>
  axios.put<Factura>(`${apiUrl}/facturas/${id}`, data);
export const deleteFactura = async (id: number) => axios.delete(`${apiUrl}/facturas/${id}`);

// Otros endpoints según tu backend...
