import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

interface JobQuestion {
  id: string;
  question_text: string;
  question_type: string;
  created_at: string;
}

interface Answer {
  id: string;
  question_id: string;
  candidate_id: string;
  job_posting_id: string;
  answer: string;
  created_at: string;
  updated_at: string;
  candidate_name?: string;
  candidate_email?: string;
}

interface JobQuestionsWithAnswersResponse {
  questions: JobQuestion[];
  answers: Answer[];
  candidates_with_answers: {
    candidate_id: string;
    candidate_name: string;
    candidate_email: string;
    answers: {
      question_id: string;
      answer_text: string;
      created_at: string;
    }[];
  }[];
}

export const useGetJobQuestionsWithAnswers = (jobId: string) => {
  const [data, setData] = useState<JobQuestionsWithAnswersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestionsWithAnswers = async () => {
    if (!jobId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const [questionsResponse, answersResponse] = await Promise.all([
        fetchWithAuth(`${CONFIG.apiUrl}/job-postings/${jobId}/questions`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }),
        fetchWithAuth(`${CONFIG.apiUrl}/recruiters/job-postings/${jobId}/answers`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      ]);

      if (!questionsResponse.ok) {
        throw new Error(`Error obteniendo preguntas: ${questionsResponse.status}`);
      }

      if (!answersResponse.ok) {
        throw new Error(`Error obteniendo respuestas: ${answersResponse.status}`);
      }

      const questionsData = await questionsResponse.json();
      const answersData = await answersResponse.json();

      const candidatesMap = new Map();
      
      answersData.answers?.forEach((answer: any) => {
        const candidateId = answer.candidate_id;
        
        if (!candidatesMap.has(candidateId)) {
          candidatesMap.set(candidateId, {
            candidate_id: candidateId,
            candidate_name: answer.candidate_name || 'Candidato',
            candidate_email: answer.candidate_email || 'Email no disponible',
            answers: []
          });
        }
        
        candidatesMap.get(candidateId).answers.push({
          question_id: answer.question_id,
          answer_text: answer.answer,
          created_at: answer.created_at
        });
      });

      const processedData = {
        questions: questionsData.questions || [],
        answers: answersData.answers || [],
        candidates_with_answers: Array.from(candidatesMap.values())
      };

      setData(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener las preguntas y respuestas');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionsWithAnswers();
  }, [jobId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchQuestionsWithAnswers,
  };
};