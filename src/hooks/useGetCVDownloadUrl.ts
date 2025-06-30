// src/hooks/useGetCVDownloadUrl.ts
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';

interface CVDownloadUrlResponse {
  url: string;
  filename: string;
}

export function useGetCVDownloadUrl(
  jobId: string,
  cvId: string,
  isEnabled: boolean
) {
  const [data, setData] = useState<CVDownloadUrlResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEnabled || !jobId || !cvId) return;

    const fetchUrl = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(
          `https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/job-postings/${jobId}/cv/${cvId}/download-url`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || 'Error al obtener URL del CV');
        }

        const json = await response.json();
        setData(json); // { url, filename }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrl();
  }, [jobId, cvId, isEnabled]);

  return { data, isLoading, error };
}
