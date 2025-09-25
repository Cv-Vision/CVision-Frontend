import { useCallback, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

export interface RecruiterProfileData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  position: string;
  bio: string;
  avatarUrl?: string;
}

export const useUpdateRecruiterProfile = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (profileData: RecruiterProfileData) => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // Actualizar perfil de reclutador (solo campos disponibles en el backend)
      const response = await fetchWithAuth(`${CONFIG.apiUrl}/recruiter/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profileData.email,
          company: profileData.company,
          position: profileData.position,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el perfil');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateProfile,
    loading,
    success,
    error,
  };
};

