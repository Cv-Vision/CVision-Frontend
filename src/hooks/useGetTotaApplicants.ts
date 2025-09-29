import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';



export const useGetTotaApplicants = () => {
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalApplicants = async () => {
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
          `${CONFIG.apiUrl}/recruiter/applicants/count`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );

        if (!response.ok) {
          throw new Error('Error al obtener el total de candidatos');
        }

        const data = await response.json();
        setTotalApplicants(data.applicant_count || 0);
      } catch (err: any) {
        setError(err.message || 'Error al obtener el total de candidatos');
        console.error('Error en useGetTotaApplicants:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalApplicants();
  }, []);

  return { totalApplicants, isLoading, error };
}; 