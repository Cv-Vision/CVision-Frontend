import { useState } from 'react';
import { deleteAnalysisResults } from '@/services/geminiAnalysisService';

export function useDeleteAnalysisResults() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteResults = async (jobId: string, cvIds: string[]) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await deleteAnalysisResults(jobId, cvIds);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al eliminar análisis');
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    deleteResults,
    isLoading,
    error,
    success,
    resetState,
  };
} 