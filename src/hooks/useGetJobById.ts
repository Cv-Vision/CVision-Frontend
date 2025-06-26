import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { Job } from '@/context/JobContext';

export function useGetJobById(jobId: string) {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const loadJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = sessionStorage.getItem('idToken');
        if (!token) throw new Error('No autorizado');
        const res = await fetchWithAuth(
          'https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/job-postings',
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
    };
    loadJob();
  }, [jobId]);


  return { job, isLoading, error };
}
