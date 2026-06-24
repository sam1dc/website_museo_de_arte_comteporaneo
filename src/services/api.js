// Configuración base de la API (FastAPI)
export const API_BASE_URL = 'http://127.0.0.1:8001/api/v1';

export const apiCall = async (endpoint, options = {}) => {
  // Determinar si la petición va a FastAPI directamente o si pasa por el proxy a Laravel
  let resolvedEndpoint = endpoint;
  if (!endpoint.startsWith('/laravel')) {
    const isFastApiRoute =
      // endpoint.startsWith('/obras') ||
      // endpoint.startsWith('/generos') ||
      // endpoint.startsWith('/artistas') ||
      endpoint.startsWith('/recomendaciones') ||
      endpoint.startsWith('/admin/obras') ||
      endpoint.startsWith('/admin/artistas') ||
      endpoint.startsWith('/admin/generos') ||
      endpoint.startsWith('/admin/reportes/auditoria');

    if (!isFastApiRoute) {
      resolvedEndpoint = `/laravel${endpoint}`;
    }
  }

  const url = `${API_BASE_URL}${resolvedEndpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
