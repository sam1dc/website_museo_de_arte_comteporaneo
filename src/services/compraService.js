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

  obtenerSolicitudesPendientes: async () => {
    const response = await apiCall('/admin/solicitudes-compra');
    return response.data || response;
  },

  generarFactura: async (solicitud) => {
    // Obtener el admin_emite_id del localStorage
    const adminAuth = JSON.parse(localStorage.getItem('adminAuth') || '{}');
    const adminId = adminAuth.data?.empleado_id || adminAuth.empleado_id || 1;

    const nombreCompleto = solicitud.comprador?.nombre_completo || 
                          `${solicitud.comprador?.nombres || ''} ${solicitud.comprador?.apellidos || ''}`.trim();

    const facturaData = {
      comprador_id: solicitud.comprador_id,
      obra_id: solicitud.obra_id,
      precio_base_usd: solicitud.precio_obra,
      museo_pct: (solicitud.comision_museo / solicitud.precio_obra) * 100,
      admin_emite_id: adminId,
      envio: {
        destinatario: nombreCompleto || 'Comprador',
        direccion: solicitud.direccion_envio || solicitud.comprador?.direccion || 'Por definir',
        ciudad: solicitud.ciudad || solicitud.comprador?.ciudad || 'Por definir',
        pais: solicitud.pais || solicitud.comprador?.pais || 'Por definir',
        codigo_postal: solicitud.codigo_postal || '',
      }
    };

    const response = await apiCall('/admin/facturas', {
      method: 'POST',
      body: JSON.stringify(facturaData),
    });
    return response.data || response;
  },
};
