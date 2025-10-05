import { useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

export type CreateJobPayload = {
  title: string;
  description: string;
  company?: string; // optional (falls back to title server-side if omitted)
  country?: string; // defaults to "AR" (Argentina), max 2 chars
  province: string; // required - must be valid Argentine province
  city: string; // required - must be valid city for the specified province
  experience_level?: 'JUNIOR' | 'SEMISENIOR' | 'SENIOR';
  english_level?: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE' | 'NOT_REQUIRED';
  industry_experience?: Record<string, any>; // flexible backend dict (e.g. { fintech: 3 })
  contract_type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  additional_requirements?: Record<string, any> | string; // object or legacy string
  modal?: 'REMOTE' | 'ONSITE' | 'HYBRID'; // optional
  questions?: {
    id: string;
    text: string;
    type: 'YES_NO' | 'OPEN' | 'NUMERICAL';
  }[]; // legacy structured questions from UI
};

export function useCreateJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [postingId, setPostingId] = useState<string | null>(null);

  const createJob = async (payload: CreateJobPayload) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setPostingId(null);

    try {
      let token = sessionStorage.getItem('idToken');
      if (!token) {
        console.warn('No hay token en sesión, usando token falso para desarrollo');
        token = 'fake-token';
      }

      // Build request body according to new API contract
      const body: Record<string, any> = { ...payload };

      // Map legacy structured questions to applicant_questions (array of strings)
      if (body.questions) {
        const applicantQuestions = body.questions
          .map((q: any) => (q?.text || '').trim())
          .filter((t: string) => t.length > 0);
        if (applicantQuestions.length > 0) {
          body.applicant_questions = applicantQuestions;
        }
        delete body.questions;
      }

      // Remove undefined fields
      Object.keys(body).forEach(k => {
        if (body[k] === undefined) delete body[k];
      });

      const response = await fetchWithAuth(
        `${CONFIG.apiUrl}/job-postings`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        let errMsg = 'Error al crear el puesto';
        try {
          const errData = await response.json();
          errMsg = errData.message || errMsg;
        } catch {/* ignore json parse */}
        throw new Error(errMsg);
      }

      const resJson = await response.json().catch(() => ({}));
      if (resJson.posting_id) setPostingId(resJson.posting_id);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createJob, isSubmitting, error, success, postingId };
}
