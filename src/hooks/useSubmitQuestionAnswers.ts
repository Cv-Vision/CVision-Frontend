import { useState } from 'react';
import { submitJobQuestionAnswers } from '@/services/applicantService';

interface QuestionAnswer {
  questionId: string;
  answer: string | null;
}

export const useSubmitQuestionAnswers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitAnswers = async (jobId: string, answers: QuestionAnswer[], overwrite: boolean = true) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await submitJobQuestionAnswers(jobId, answers, overwrite);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { submitAnswers, isLoading, error, success };
};
