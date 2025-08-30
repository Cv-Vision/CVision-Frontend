import { useState } from 'react';
import { applyToJob } from '@/services/applicantService.ts';

export const useApplyToJob = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apply = async (jobId: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await applyToJob(jobId);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { apply, isLoading, success, error };
};
