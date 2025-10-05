import { useState } from 'react';
import { CONFIG } from '@/config';

export const useDeleteApplication = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteApplication = async (applicationId: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      const idToken = sessionStorage.getItem('idToken');
      if (!idToken) {
        throw new Error('No autenticado');
      }

      const response = await fetch(`${CONFIG.apiUrl}/applications/${applicationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la aplicación');
      }

      const result = await response.json();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteApplication,
    isDeleting,
    error,
  };
};
