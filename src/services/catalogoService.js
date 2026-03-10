// Servicio para catálogo público (obras y géneros)
import { apiCall } from './api';

export const catalogoService = {
  // Obras
  obtenerObras: async () => {
    const response = await apiCall('/obras');
    return response.data || response;
  },
  obtenerObraDetalle: async (id) => {
    const response = await apiCall(`/obras/${id}`);
    return response.data || response;
  },

  // Géneros
  obtenerGeneros: async () => {
    const response = await apiCall('/generos');
    return response.data || response;
  },
};
