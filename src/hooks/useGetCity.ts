import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

interface CitiesResponse {
  province: string;
  cities: string[];
  count: number;
}

interface UseGetCitiesReturn {
  cities: string[];
  province: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetCities(provinceName: string | null): UseGetCitiesReturn {
  const [cities, setCities] = useState<string[]>([]);
  const [province, setProvince] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    if (!provinceName?.trim()) {
      setCities([]);
      setProvince(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const encodedProvince = encodeURIComponent(provinceName.trim());
      const response = await fetchWithAuth(
        `${CONFIG.apiUrl}/locations/cities?province=${encodedProvince}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Province parameter is required');
        } else if (response.status === 404) {
          throw new Error(`Province '${provinceName}' not found`);
        } else {
          throw new Error(`Error ${response.status}: Failed to fetch cities`);
        }
      }

      const data: CitiesResponse = await response.json();
      setCities(data.cities || []);
      setProvince(data.province);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cities';
      setError(errorMessage);
      setCities([]);
      setProvince(null);
      console.error('Error fetching cities:', err);
    } finally {
      setIsLoading(false);
    }
  }, [provinceName]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Reset cities when province changes to null/empty
  useEffect(() => {
    if (!provinceName?.trim()) {
      setCities([]);
      setProvince(null);
      setError(null);
    }
  }, [provinceName]);

  return {
    cities,
    province,
    isLoading,
    error,
    refetch: fetchCities,
  };
}
