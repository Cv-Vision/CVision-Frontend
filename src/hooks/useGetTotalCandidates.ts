import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';

interface Job {
  pk: string;
  title: string;
  status: string;
}

export const useGetTotalCandidates = () => {
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTotalCandidates = async () => {
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
          `${process.env.VITE_API_URL}/recruiter/job-postings`,
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
            
            const candidatesResponse = await fetch(
              `${process.env.VITE_API_URL}/recruiter/job-postings/${jobId}/candidates`,
              { headers: { Authorization: `Bearer ${idToken}` } }
            );
            
            if (candidatesResponse.ok) {
              const data = await candidatesResponse.json();
              const candidateCount = (data.candidates || []).length;
              total += candidateCount;
              
              jobDetails.push({
                jobTitle: job.title,
                jobId: jobId,
                candidates: candidateCount
              });
              
              console.log(`Puesto "${job.title}": ${candidateCount} candidatos`);
            } else {
              console.warn(`Error en respuesta para puesto ${job.title}:`, candidatesResponse.status);
            }
          } catch (err) {
            console.warn(`Error fetching candidates for job ${job.pk}:`, err);
            // Continuar con otros trabajos incluso si uno falla
          }
        }
        
        console.log('Detalles por puesto:', jobDetails);
        console.log('Total de candidatos:', total);
        
        setTotalCandidates(total);
      } catch (err: any) {
        setError(err.message || 'Error al obtener el total de candidatos');
        console.error('Error en useGetTotalCandidates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalCandidates();
  }, []);

  return { totalCandidates, isLoading, error };
}; 