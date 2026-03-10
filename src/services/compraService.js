// Servicio para compras
import { apiCall } from './api';

export const compraService = {
  crearSolicitud: (datos) => apiCall('/solicitudes-compra', {
    method: 'POST',
    body: JSON.stringify(datos),
  }),

  obtenerMisCompras: async (compradorId) => {
    const response = await apiCall(`/mis-compras?comprador_id=${compradorId}`);
    return response.data || response;
  },
};
