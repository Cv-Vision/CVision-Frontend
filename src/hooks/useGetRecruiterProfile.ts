import { useCallback, useState, useEffect } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

export interface RecruiterProfileResponse {
  email: string;
  company: string;
  name: string;
  position?: string;
}

export const useGetRecruiterProfile = () => {
  const [profile, setProfile] = useState<RecruiterProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`${CONFIG.apiUrl}/recruiter/profile`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error al obtener el perfil del reclutador');
      }

      const data = await response.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
