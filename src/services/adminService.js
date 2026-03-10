// Servicio para panel administrativo
import { apiCall } from './api';

// Dashboard
export const dashboardService = {
  obtenerResumen: async () => {
    const response = await apiCall('/admin/dashboard');
    return response.data || response;
  },
};

// Usuarios (empleados)
export const usuariosAdminService = {
  obtenerTodos: async () => {
    const response = await apiCall('/admin/usuarios');
    return response.data || response;
  },
  obtenerDetalle: async (id) => {
    const response = await apiCall(`/admin/usuarios/${id}`);
    return response.data || response;
  },
  crear: async (datos) => {
    const response = await apiCall('/admin/usuarios', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  actualizar: async (id, datos) => {
    const response = await apiCall(`/admin/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  eliminar: (id) => apiCall(`/admin/usuarios/${id}`, {
    method: 'DELETE',
  }),
};

// Géneros
export const generosAdminService = {
  obtenerTodos: async () => {
    const response = await apiCall('/admin/generos');
    return response.data || response;
  },
  obtenerDetalle: async (id) => {
    const response = await apiCall(`/admin/generos/${id}`);
    return response.data || response;
  },
  crear: async (datos) => {
    const response = await apiCall('/admin/generos', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  actualizar: async (id, datos) => {
    const response = await apiCall(`/admin/generos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  eliminar: (id) => apiCall(`/admin/generos/${id}`, {
    method: 'DELETE',
  }),
};

// Artistas
export const artistasAdminService = {
  obtenerTodos: async () => {
    const response = await apiCall('/admin/artistas');
    return response.data || response;
  },
  obtenerDetalle: async (id) => {
    const response = await apiCall(`/admin/artistas/${id}`);
    return response.data || response;
  },
  crear: async (datos) => {
    const response = await apiCall('/admin/artistas', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  actualizar: async (id, datos) => {
    const response = await apiCall(`/admin/artistas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  eliminar: (id) => apiCall(`/admin/artistas/${id}`, {
    method: 'DELETE',
  }),
};

// Obras
export const obrasAdminService = {
  obtenerTodos: async () => {
    const response = await apiCall('/admin/obras');
    return response.data || response;
  },
  obtenerDetalle: async (id) => {
    const response = await apiCall(`/admin/obras/${id}`);
    return response.data || response;
  },
  crear: async (datos) => {
    const response = await apiCall('/admin/obras', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  actualizar: async (id, datos) => {
    const response = await apiCall(`/admin/obras/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  eliminar: (id) => apiCall(`/admin/obras/${id}`, {
    method: 'DELETE',
  }),
};

// Compradores
export const compradoresAdminService = {
  obtenerTodos: async () => {
    const response = await apiCall('/admin/compradores');
    return response.data || response;
  },
  obtenerDetalle: async (id) => {
    const response = await apiCall(`/admin/compradores/${id}`);
    return response.data || response;
  },
  crear: async (datos) => {
    const response = await apiCall('/admin/compradores', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  actualizar: async (id, datos) => {
    const response = await apiCall(`/admin/compradores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
  eliminar: (id) => apiCall(`/admin/compradores/${id}`, {
    method: 'DELETE',
  }),
};

// Facturas
export const facturasAdminService = {
  obtenerTodos: async () => {
    const response = await apiCall('/admin/facturas');
    return response.data || response;
  },
  obtenerDetalle: async (id) => {
    const response = await apiCall(`/admin/facturas/${id}`);
    return response.data || response;
  },
  crear: async (datos) => {
    const response = await apiCall('/admin/facturas', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    return response.data || response;
  },
};

// Solicitudes de compra
export const solicitudesCompraAdminService = {
  obtenerTodos: async () => {
    const response = await apiCall('/admin/solicitudes-compra');
    return response.data || response;
  },
  obtenerDetalle: async (id) => {
    const response = await apiCall(`/admin/solicitudes-compra/${id}`);
    return response.data || response;
  },
  cancelar: async (id) => {
    const response = await apiCall(`/admin/solicitudes-compra/${id}/cancelar`, {
      method: 'PATCH',
    });
    return response.data || response;
  },
};

// Reportes
export const reportesAdminService = {
  obrasVendidas: async () => {
    const response = await apiCall('/admin/reportes/obras-vendidas');
    return response.data || response;
  },
  facturacion: async () => {
    const response = await apiCall('/admin/reportes/facturacion');
    return response.data || response;
  },
  membresias: async () => {
    const response = await apiCall('/admin/reportes/membresias');
    return response.data || response;
  },
  perfil: async () => {
    const response = await apiCall('/admin/perfil');
    return response.data || response;
  },
};
