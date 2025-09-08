import { useState, useCallback } from 'react';
import { CONFIG } from '@/config';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export type QuestionType = 'OPEN' | 'YES_NO' | 'NUMERICAL';

export interface JobQuestion {
  id: string;
  question: string;
  questionType: QuestionType;
  order: number;
}

type RawQuestion = {
  id?: string;
  question_id?: string;
  question?: string;
  text?: string;
  questionType?: QuestionType;
  type?: QuestionType;
  order?: number;
};

type ApiPayload = { questions: RawQuestion[] } | RawQuestion[];

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
      const raw = await fetchWithAuth(
        `${CONFIG.apiUrl}/job-postings/${jobId}/questions`,
        { method: 'GET' }
      );

      // Verificar si es una Response o ya está parseado
      let data: ApiPayload;

      if (raw && typeof (raw as any).json === 'function') {
        // Es una Response, necesitamos parsear
        data = await (raw as Response).json();
      } else {
        // Ya está parseado, hacer cast seguro
        data = raw as unknown as ApiPayload;
      }

      const arr: RawQuestion[] = Array.isArray(data)
        ? data
        : (data as any)?.questions ?? [];

      const parsed: JobQuestion[] = arr
        .map((q: RawQuestion, idx: number) => ({
          id:
            String(
              q.id ??
              q.question_id ??
              // fallback seguro si no hay id en backend
              ((globalThis as any).crypto?.randomUUID?.() ?? `q-${idx}`)
            ),
          question: String(q.question ?? q.text ?? ''),
          questionType: (q.questionType ?? q.type ?? 'OPEN') as QuestionType,
          order: typeof q.order === 'number' ? q.order : 9999
        }))
        .sort(
          (a: JobQuestion, b: JobQuestion) =>
            (a.order ?? 0) - (b.order ?? 0)
        );

      setQuestions(parsed);
    } catch (e: any) {
      setError(e?.message ?? 'Error al cargar las preguntas');
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { questions, isLoading, error, fetchQuestions };
}