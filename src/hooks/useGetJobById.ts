import { useEffect, useState, useCallback } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { Job } from '@/context/JobContext';
import { CONFIG } from '@/config';

export function useGetJobById(jobId: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJob = useCallback(async () => {
    if (!jobId) return;

    setLoading(true);
    setError(null);
    try {
      // Para desarrollo: usar un token falso si no hay uno real
      let token = sessionStorage.getItem('idToken');
      if (!token) {
        console.warn('No hay token en sesión, usando token falso para desarrollo');
        token = 'fake-token';
      }

      // Usar el endpoint correcto del backend
      const res = await fetchWithAuth(
        `${CONFIG.apiUrl}/job-postings/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!res.ok) throw new Error('Error al cargar el job');
      
      const jobData = await res.json();
      
      // Mapear la respuesta del backend al formato que espera el frontend
      const mappedJob: Job = {
        pk: jobData.posting_id || '',
        title: jobData.title || '',
        description: jobData.description || '',
        company: jobData.company || '',
        status: jobData.status || '',
        questions: jobData.questions || [],
        experience_level: jobData.experience_level,
        english_level: jobData.english_level,
        contract_type: jobData.contract_type,
        country: jobData.country,
        province: jobData.province,
        city: jobData.city,
        industry_experience: jobData.industry_experience,
        additional_requirements: jobData.additional_requirements,
        modal: jobData.modal,
        created_at: jobData.created_at
      };
      
      setJob(mappedJob);
    } catch (err) {
      console.error('Error fetching job:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  const refetch = useCallback(() => {
    loadJob();
  }, [loadJob]);

  return { job, isLoading, error, refetch };
}
