import { useEffect, useState, useCallback } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

export interface JobPosition {
  posting_id: string;
  title: string;
  description: string;
  company: string;
  status: string;
  experience_level?: string;
  english_level?: string;
  contract_type?: string;
  country?: string;
  province?: string;
  city?: string;
  modal?: string; // REMOTE, ONSITE, HYBRID
  industry_experience?: {
    required: boolean;
    industry?: string;
  };
  additional_requirements?: string;
  created_at?: string;
  updated_at?: string;
}

export function useGetJobPosition(positionId: string) {
  const [jobPosition, setJobPosition] = useState<JobPosition | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobPosition = useCallback(async () => {
    if (!positionId) return;

    setLoading(true);
    setError(null);
    try {
      // Para desarrollo: usar un token falso si no hay uno real
      let token = sessionStorage.getItem('idToken');
      let headers: Record<string, string> = {};
      let endpoint = `${CONFIG.apiUrl}/job-postings/${positionId}/public`;
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      } else {
        // Si no hay token, usar el endpoint público
        endpoint = `${CONFIG.apiUrl}/job-postings/${positionId}/public`;
        console.log('Usando endpoint público para obtener información de la posición');
      }

      // Usar el endpoint correcto del backend
      const res = await fetchWithAuth(endpoint, { headers });
      
      if (!res.ok) throw new Error('Error al cargar la posición');
      
      const jobData = await res.json();
      setJobPosition(jobData);
    } catch (err) {
      console.error('Error fetching job position:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [positionId]);

  useEffect(() => {
    loadJobPosition();
  }, [loadJobPosition]);

  const refetch = useCallback(() => {
    loadJobPosition();
  }, [loadJobPosition]);

  return { jobPosition, isLoading, error, refetch };
}
