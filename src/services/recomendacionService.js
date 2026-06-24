import { apiCall } from './api';

export const recomendacionService = {
  obtenerSugerencias: async (compradorId) => {
    const response = await apiCall(`/recomendaciones/comprador/${compradorId}/sugerencias`);
    return response;
  },
  registrarCompra: async (datos) => {
    const response = await apiCall('/recomendaciones/registrar-compra', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
    return response;
  }
};
