export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = sessionStorage.getItem('accessToken');

  if (!token) {
    throw new Error('No access token found. Please log in.');
  }

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  const mergedHeaders = {
    ...init?.headers,
    ...authHeaders,
  };

  const mergedInit: RequestInit = {
    ...init,
    headers: mergedHeaders,
  };

  const response = await fetch(input, mergedInit);

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
}
