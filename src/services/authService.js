// Servicio para autenticación
import { apiCall } from './api';

export const authService = {
  // Comprador
  login: (email, password) => apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  registro: (datos) => apiCall('/registro', {
    method: 'POST',
    body: JSON.stringify({
      ...datos,
      password_confirmation: datos.password
    }),
  }),

  recuperarContrasena: (email) => apiCall('/recuperar-contrasena', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  recuperarCodigoSeguridad: (email) => apiCall('/recuperar-codigo-seguridad', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Admin
  loginAdmin: (email, password) => apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  // Obtener perfil del usuario autenticado
  obtenerPerfil: (empleadoId) => apiCall(`/admin/perfil?empleado_id=${empleadoId}`),
};
