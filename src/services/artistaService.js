// Servicio para artistas
import { apiCall } from './api';

export const artistaService = {
  obtenerDetalle: async (id) => {
    const response = await apiCall(`/artistas/${id}`);
    return response.data || response;
  },
};
