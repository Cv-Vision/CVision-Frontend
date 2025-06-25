import { useCallback, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export interface UpdatePayload {
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'DELETED';
  experience_level?: 'JUNIOR' | 'SEMISENIOR' | 'SENIOR';
  english_level?: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE' | 'NOT_REQUIRED';
  industry_experience?: {
    required: boolean;
    industry?: string;
  };
  contract_type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  additional_requirements?: string;
}

export const useUpdateJobPostingData = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedJob, setUpdatedJob] = useState<any>(null);

  const updateJobPostingData = useCallback(async (jobId: string, data: UpdatePayload) => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    setUpdatedJob(null);

    try {
      const cleanId = jobId.replace('JD#', '');
      const url = `https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/job-postings/${cleanId}/update`;

      const response = await fetchWithAuth(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || 'Error al actualizar el puesto');
      }

      const result = await response.json();
      setSuccess(true);
      setUpdatedJob(result.jobPosting);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateJobPostingData,
    loading,
    success,
    error,
    updatedJob,
  };
};
