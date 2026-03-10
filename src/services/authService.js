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
    body: JSON.stringify(datos),
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
};
