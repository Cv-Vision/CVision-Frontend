import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

interface JobMetrics {
  total_analyzed: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  highest_score_applicant_name: string;
  lowest_score_applicant_name: string;
}

export const useGetJobMetrics = (jobId: string) => {
  const [metrics, setMetrics] = useState<JobMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetch, setRefetch] = useState(0);

  const refetchMetrics = () => setRefetch(prev => prev + 1);

  useEffect(() => {
    if (!jobId) return;

    const fetchMetrics = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const idToken = sessionStorage.getItem('idToken');
        if (!idToken) {
          setError('No autenticado');
          setIsLoading(false);
          return;
        }

        const response = await fetchWithAuth(
          `${CONFIG.apiUrl}/job-postings/${jobId}/metrics`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );

        if (!response.ok) {
          throw new Error('Error al obtener las métricas del puesto');
        }

        const data = await response.json();
        setMetrics(data);
      } catch (err: any) {
        setError(err.message || 'Error al obtener las métricas');
        console.error('Error in useGetJobMetrics:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [jobId, refetch]);

  return { metrics, isLoading, error, refetchMetrics };
};
