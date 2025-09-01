import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

interface Job {
  pk: string;
  title: string;
  status: string;
}

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

        // Obtener todos los puestos de trabajo primero
        const jobsResponse = await fetchWithAuth(
          `${CONFIG.apiUrl}/recruiter/job-postings`,
          { headers: { Authorization: `Bearer ${idToken}` } }
        );

        if (!jobsResponse.ok) {
          throw new Error('Error al obtener puestos de trabajo');
        }

        const jobs: Job[] = await jobsResponse.json();
        let total = 0;
        const jobDetails = []; // Para debugging

        // Solo contar candidatos de puestos activos
        const activeJobs = jobs.filter(job => job.status === 'ACTIVE');
        console.log('Puestos activos encontrados:', activeJobs.length);

        // Obtener candidatos para cada puesto de trabajo activo
        for (const job of activeJobs) {
          try {
            const jobId = job.pk.split('#')[1]; // Extraer el ID del puesto
            console.log(`Obteniendo candidatos para puesto: ${job.title} (ID: ${jobId})`);
            
            const applicantsResponse = await fetch(
              `${CONFIG.apiUrl}/recruiter/job-postings/${jobId}/applicants`,
              { headers: { Authorization: `Bearer ${idToken}` } }
            );
            
            if (applicantsResponse.ok) {
              const data = await applicantsResponse.json();
              const applicantCount = (data.applicants || []).length;
              total += applicantCount;
              
              jobDetails.push({
                jobTitle: job.title,
                jobId: jobId,
                applicants: applicantCount
              });
              
              console.log(`Puesto "${job.title}": ${applicantCount} candidatos`);
            } else {
              console.warn(`Error en respuesta para puesto ${job.title}:`, applicantsResponse.status);
            }
          } catch (err) {
            console.warn(`Error fetching applicants for job ${job.pk}:`, err);
            // Continuar con otros trabajos incluso si uno falla
          }
        }
        
        console.log('Detalles por puesto:', jobDetails);
        console.log('Total de candidatos:', total);
        
        setTotalApplicants(total);
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