// src/hooks/useGetCVDownloadUrl.ts
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

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
        const idToken = sessionStorage.getItem('idToken');
        if (!idToken) {
          throw new Error('No autenticado');
        }

        const response = await fetchWithAuth(
          `${CONFIG.apiUrl}/recruiter/job-postings/${jobId}/cv/${cvId}/download_url`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              'Content-Type': 'application/json',
            },
          }
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
