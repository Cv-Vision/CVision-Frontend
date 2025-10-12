import { CONFIG } from '@/config';

export const downloadAnalyses = async (jobId: string): Promise<Blob> => {
  const idToken = sessionStorage.getItem('idToken');
  if (!idToken) {
    throw new Error('No autenticado');
  }

  const response = await fetch(`${CONFIG.apiUrl}/job-postings/${jobId}/analyses/download`, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    // Intenta leer el cuerpo del error como JSON
    const errorBody = await response.json().catch(() => null); // Evita errores si el cuerpo no es JSON
    const errorMessage = errorBody?.message || `Error del servidor: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response.blob();
};