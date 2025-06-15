export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  const token = sessionStorage.getItem('idToken');

  if (!token) {
    throw new Error('No se encontró el token de identidad. Por favor, inicie sesión nuevamente.');
  }

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Origin': window.location.origin
  };

  const mergedHeaders = {
    ...authHeaders,
    ...init?.headers,
  };

  const mergedInit: RequestInit = {
    ...init,
    headers: mergedHeaders,
    mode: 'cors',
    credentials: 'include'
  };

  try {
    const response = await fetch(input, mergedInit);

    // Handle CORS preflight
    if (response.status === 204) {
      // This is a successful preflight response
      return response;
    }

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Clear token and redirect to login
        sessionStorage.removeItem('idToken');
        window.location.href = '/login';
        throw new Error('No autorizado. Por favor, inicie sesión nuevamente.');
      }
      if (response.status === 403) {
        throw new Error('Acceso prohibido.');
      }
      if (response.status === 500) {
        throw new Error('Error interno del servidor.');
      }

      // Try to get error message from response
      let errorMessage = `Error en la solicitud: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Silently handle JSON parse error
      }
      throw new Error(errorMessage);
    }

    return response;
  } catch (error) {
    throw error;
  }
}
