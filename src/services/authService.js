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

  recuperarCodigoSeguridad: (email, respuestas) => apiCall('/recuperar-codigo-seguridad', {
    method: 'POST',
    body: JSON.stringify({ 
      email,
      respuesta_1: respuestas[0],
      respuesta_2: respuestas[1],
      respuesta_3: respuestas[2]
    }),
  }),

  obtenerPreguntasSeguridad: (email) => apiCall(`/compradores/preguntas/${encodeURIComponent(email)}`),

  // Admin
  loginAdmin: (email, password) => apiCall('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  // Obtener perfil del usuario autenticado
  obtenerPerfil: (empleadoId) => apiCall(`/admin/perfil?empleado_id=${empleadoId}`),
};
