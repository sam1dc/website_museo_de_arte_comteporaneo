// Servicio para artistas
import { apiCall } from './api';

export const artistaService = {
  obtenerDetalle: (id) => apiCall(`/artistas/${id}`),
};
