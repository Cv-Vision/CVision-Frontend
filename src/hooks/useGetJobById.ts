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
      const token = sessionStorage.getItem('idToken');
      if (!token) throw new Error('No autorizado');
      const res = await fetchWithAuth(
        `${CONFIG.apiUrl}/recruiter/job-postings`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error('Error al cargar el job');
      const allJobs: Job[] = await res.json();
      const selected = allJobs.find((j) => j.pk === `JD#${jobId}`);
      if (!selected) throw new Error('Job no encontrado');
      setJob(selected);
    } catch (err) {
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
