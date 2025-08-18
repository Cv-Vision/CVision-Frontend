import { useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export type CreateJobPayload = {
  title: string;
  description: string;
  experience_level?: 'JUNIOR' | 'SEMISENIOR' | 'SENIOR';
  english_level?: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE' | 'NOT_REQUIRED';
  industry_experience?: { required: boolean; industry?: string };
  contract_type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  additional_requirements?: string;
  job_location?: string;
};

export function useCreateJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createJob = async (payload: CreateJobPayload) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = sessionStorage.getItem('idToken');
      if (!token) throw new Error('No hay token de sesión');

      const response = await fetchWithAuth(
        `${process.env.REACT_APP_API_URL}/recruiter/job-postings/create`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Error al crear el puesto');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createJob, isSubmitting, error, success };
}
