import { useState, useEffect } from 'react';
import { useGetJobs } from '@/hooks/useGetJobs';
import { getCVAnalysisResults } from '@/services/cvAnalysisService';

export function useCvsPerHour() {
  const { jobs } = useGetJobs();
  const [cvsPerHour, setCvsPerHour] = useState<number>(0);

  useEffect(() => {
    async function fetchCvsRate() {
      try {
        const activeJobs = jobs.filter(job => job.status === "ACTIVE");
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        let total = 0;
        await Promise.all(
          activeJobs.map(async job => {
            const results = await getCVAnalysisResults(job.pk.toString());
            total += results.filter(r => new Date(r.timestamp) >= oneHourAgo).length;
          })
        );
        setCvsPerHour(total);
      } catch (err) {
        console.error('Error al obtener CVs/hora:', err);
      }
    }
    fetchCvsRate();
  }, [jobs]);

  return cvsPerHour;
}