// Servicio para compras
import { apiCall } from './api';

export const compraService = {
  crearSolicitud: (datos) => apiCall('/solicitudes-compra', {
    method: 'POST',
    body: JSON.stringify(datos),
  }),
};
