// src/hooks/useGetCVDownloadUrl.ts
import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

interface CVDownloadUrlResponse {
  download_url: string;
}

export function useGetCVDownloadUrl(
  cvKey: string,
  isEnabled: boolean
) {
  const [data, setData] = useState<CVDownloadUrlResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEnabled || !cvKey) return;

    const fetchUrl = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchWithAuth(
          `${CONFIG.apiUrl}/download/cv/${cvKey}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || 'Error al obtener URL del CV');
        }

        const json = await response.json();
        setData(json); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrl();
  }, [cvKey, isEnabled]);

  return { data, isLoading, error };
}
