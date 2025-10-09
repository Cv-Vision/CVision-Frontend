import { useState, useCallback } from 'react';

interface UseCheckJobHasQuestionsReturn {
  hasQuestions: boolean;
  isLoading: boolean;
  error: string | null;
  checkForQuestions: (jobId: string) => Promise<void>;
}

export function useCheckJobHasQuestions(): UseCheckJobHasQuestionsReturn {
  const [hasQuestions, setHasQuestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkForQuestions = useCallback(async (_jobId: string) => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setHasQuestions(true);
      setIsLoading(false);
    }, 100);
  }, []);

  return { hasQuestions, isLoading, error, checkForQuestions };
}