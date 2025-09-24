import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

interface ProvincesResponse {
  provinces: string[];
  count: number;
}

interface UseGetProvincesReturn {
  provinces: string[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetProvinces(): UseGetProvincesReturn {
  const [provinces, setProvinces] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProvinces = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`${CONFIG.apiUrl}/locations/provinces`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch provinces`);
      }

      const data: ProvincesResponse = await response.json();
      setProvinces(data.provinces || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch provinces';
      setError(errorMessage);
      console.error('Error fetching provinces:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  return {
    provinces,
    isLoading,
    error,
    refetch: fetchProvinces,
  };
}
