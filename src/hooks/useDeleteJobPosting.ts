import { useCallback, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

export const useDeleteJobPosting = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteJobPosting = useCallback(async (jobId: string) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const cleanId = jobId.replace('JD#', '');
      // Usar el endpoint DELETE correcto del backend
      const url = `${CONFIG.apiUrl}/job-postings/${cleanId}`;

      const response = await fetchWithAuth(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Error al eliminar el puesto');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    deleteJobPosting,
    loading,
    success,
    error,
  };
};
