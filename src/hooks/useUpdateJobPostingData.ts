import { useCallback, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

export interface UpdatePayload {
  title?: string; // optional per new API
  description?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'DELETED';
  experience_level?: 'JUNIOR' | 'SEMISENIOR' | 'SENIOR';
  english_level?: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE' | 'NOT_REQUIRED';
  industry_experience?: Record<string, any>; // backend now expects a free-form object (e.g., {"fintech": 5})
  contract_type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  additional_requirements?: Record<string, any> | string; // may be object or legacy string
  location?: string;
  company?: string;
  modal?: 'REMOTE' | 'ONSITE' | 'HYBRID' | null; // null allowed to clear
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
      const url = `${CONFIG.apiUrl}/job-postings/${cleanId}`;

      // Remove undefined fields to avoid accidentally sending them
      const payload: Record<string, any> = {};
      Object.entries(data).forEach(([k, v]) => {
        if (v !== undefined) payload[k] = v; // allow null (for modal clearing)
      });

      const response = await fetchWithAuth(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorBody: unknown = null;
        try { errorBody = await response.json(); } catch { /* ignore */ }
        let validationMsg = 'Error al actualizar el puesto';
        if (errorBody && typeof errorBody === 'object') {
          const err = errorBody as { message?: string };
          if (err.message) validationMsg = err.message;
        }
        throw new Error(validationMsg);
      }

      const result = await response.json(); // { posting_id, message }
      setSuccess(true);
      setUpdatedJob(result); // store entire response for caller (posting_id + message)
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
