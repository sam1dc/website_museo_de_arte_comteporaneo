// Servicio para panel administrativo
import { apiCall } from './api';

// Dashboard
export const dashboardService = {
  obtenerResumen: () => apiCall('/admin/dashboard'),
};

// Usuarios (empleados)
export const usuariosAdminService = {
  obtenerTodos: () => apiCall('/admin/usuarios'),
  obtenerDetalle: (id) => apiCall(`/admin/usuarios/${id}`),
  crear: (datos) => apiCall('/admin/usuarios', {
    method: 'POST',
    body: JSON.stringify(datos),
  }),
  actualizar: (id, datos) => apiCall(`/admin/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  }),
  eliminar: (id) => apiCall(`/admin/usuarios/${id}`, {
    method: 'DELETE',
  }),
};

// Géneros
export const generosAdminService = {
  obtenerTodos: () => apiCall('/admin/generos'),
  obtenerDetalle: (id) => apiCall(`/admin/generos/${id}`),
  crear: (datos) => apiCall('/admin/generos', {
    method: 'POST',
    body: JSON.stringify(datos),
  }),
  actualizar: (id, datos) => apiCall(`/admin/generos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  }),
  eliminar: (id) => apiCall(`/admin/generos/${id}`, {
    method: 'DELETE',
  }),
};

// Artistas
export const artistasAdminService = {
  obtenerTodos: () => apiCall('/admin/artistas'),
  obtenerDetalle: (id) => apiCall(`/admin/artistas/${id}`),
  crear: (datos) => apiCall('/admin/artistas', {
    method: 'POST',
    body: JSON.stringify(datos),
  }),
  actualizar: (id, datos) => apiCall(`/admin/artistas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  }),
  eliminar: (id) => apiCall(`/admin/artistas/${id}`, {
    method: 'DELETE',
  }),
};

// Obras
export const obrasAdminService = {
  obtenerTodos: () => apiCall('/admin/obras'),
  obtenerDetalle: (id) => apiCall(`/admin/obras/${id}`),
  crear: (datos) => apiCall('/admin/obras', {
    method: 'POST',
    body: JSON.stringify(datos),
  }),
  actualizar: (id, datos) => apiCall(`/admin/obras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  }),
  eliminar: (id) => apiCall(`/admin/obras/${id}`, {
    method: 'DELETE',
  }),
};

// Compradores
export const compradoresAdminService = {
  obtenerTodos: () => apiCall('/admin/compradores'),
  obtenerDetalle: (id) => apiCall(`/admin/compradores/${id}`),
  crear: (datos) => apiCall('/admin/compradores', {
    method: 'POST',
    body: JSON.stringify(datos),
  }),
  actualizar: (id, datos) => apiCall(`/admin/compradores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  }),
  eliminar: (id) => apiCall(`/admin/compradores/${id}`, {
    method: 'DELETE',
  }),
};

// Facturas
export const facturasAdminService = {
  obtenerTodos: () => apiCall('/admin/facturas'),
  obtenerDetalle: (id) => apiCall(`/admin/facturas/${id}`),
  crear: (datos) => apiCall('/admin/facturas', {
    method: 'POST',
    body: JSON.stringify(datos),
  }),
};

// Solicitudes de compra
export const solicitudesCompraAdminService = {
  obtenerTodos: () => apiCall('/admin/solicitudes-compra'),
  obtenerDetalle: (id) => apiCall(`/admin/solicitudes-compra/${id}`),
  cancelar: (id) => apiCall(`/admin/solicitudes-compra/${id}/cancelar`, {
    method: 'PATCH',
  }),
};

// Reportes
export const reportesAdminService = {
  obrasVendidas: () => apiCall('/admin/reportes/obras-vendidas'),
  facturacion: () => apiCall('/admin/reportes/facturacion'),
  membresias: () => apiCall('/admin/reportes/membresias'),
  perfil: () => apiCall('/admin/perfil'),
};
