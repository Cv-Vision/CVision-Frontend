export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = sessionStorage.getItem('idToken');

  if (!token) {
    throw new Error('No se encontró el token de identidad. Por favor, inicie sesión nuevamente.');
  }

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
  };

  const mergedHeaders = {
    ...init?.headers,
    ...authHeaders,
  };

  const mergedInit: RequestInit = {
    ...init,
    headers: mergedHeaders,
    credentials: 'include'  // Añadido para asegurar que las credenciales se envíen
  };

  try {
    const response = await fetch(input, mergedInit);
    
    // Debug logging
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      // Manejo global de errores
      if (response.status === 401) {
        throw new Error('No autorizado. ¿El token expiró?');
      }
      if (response.status === 403) {
        throw new Error('Acceso prohibido.');
      }
      if (response.status === 500) {
        throw new Error('Error interno del servidor.');
      }
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
