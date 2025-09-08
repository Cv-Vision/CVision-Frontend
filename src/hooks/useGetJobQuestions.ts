import { useState } from 'react';
import { CONFIG } from '@/config';
import { fetchWithAuth } from '@/services/fetchWithAuth';

interface JobQuestion {
  id: string;
  question: string;
  questionType: 'OPEN' | 'YES_NO' | 'NUMERICAL';
  order: number;
}

interface UseJobQuestionsReturn {
  questions: JobQuestion[];
  isLoading: boolean;
  error: string | null;
  fetchQuestions: (jobId: string) => Promise<void>;
}

export const useGetJobQuestions = (): UseJobQuestionsReturn => {
  const [questions, setQuestions] = useState<JobQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async (jobId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem('idToken');
      if (!token) throw new Error('No autenticado');

      const res = await fetchWithAuth(
        `${CONFIG.apiUrl}/job-postings/${jobId}/questions`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        if (res.status === 401) throw new Error('No autenticado');
        if (res.status === 400) throw new Error('Falta parámetro posting_id');
        throw new Error('Error en el servidor');
      }

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    questions,
    isLoading,
    error,
    fetchQuestions
  };
};