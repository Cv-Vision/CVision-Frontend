import { useEffect, useState } from 'react';
import { getGeminiAnalysisResults, GeminiAnalysisResult } from '@/services/geminiAnalysisService';

// Extiendo el tipo para soportar created_at
interface GeminiAnalysisResultWithCreatedAt extends GeminiAnalysisResult {
  created_at?: string;
}

export const useGetAnalysisResults = (jobId: string) => {
  const [results, setResults] = useState<GeminiAnalysisResultWithCreatedAt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = async (skipLoading = false) => {
    if (!skipLoading) {
      setIsLoading(true);
      setError(null);
    }

    try {
      const data = await getGeminiAnalysisResults(jobId);
      // Ordenar resultados de mayor a menor score
      const sortedResults = [...data].sort((a, b) => b.score - a.score);
      setResults(sortedResults);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!skipLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;
    // initial fetch shows loading, subsequent polls are silent
    fetchResults();
    const intervalId = setInterval(() => fetchResults(true), 4000);
    return () => clearInterval(intervalId);
  }, [jobId]);

  return { results, isLoading, error, refetch: fetchResults };
}; 