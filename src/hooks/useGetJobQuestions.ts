import { useState, useCallback } from 'react';
import { CONFIG } from '@/config';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export type QuestionType = 'OPEN' | 'YES_NO' | 'NUMERICAL';

export interface JobQuestion {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
}

interface BackendResponse {
  questions: JobQuestion[];
}

interface UseJobQuestionsReturn {
  questions: JobQuestion[];
  isLoading: boolean;
  error: string | null;
  fetchQuestions: (jobId: string) => Promise<void>;
}

export function useGetJobQuestions(): UseJobQuestionsReturn {
  const [questions, setQuestions] = useState<JobQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (jobId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(
        `${CONFIG.apiUrl}/job-postings/${jobId}/questions`,
        { method: 'GET' }
      );

      const data: BackendResponse = await response.json();

      const sortedQuestions = data.questions.sort((a, b) => a.order - b.order);
      setQuestions(sortedQuestions);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar las preguntas');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { questions, isLoading, error, fetchQuestions };
}