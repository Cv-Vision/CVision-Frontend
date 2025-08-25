// /src/hooks/useCreateJobForm.ts
import { useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

export type PreguntaPayload = {
  texto: string;
  tipo: 'si_no' | 'desarrollo';
};

export type CreateJobPayload = {
  title: string;
  description: string;
  experience_level?: 'JUNIOR' | 'SEMISENIOR' | 'SENIOR';
  english_level?: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE' | 'NOT_REQUIRED';
  industry_experience?: { required: boolean; industry?: string };
  contract_type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP';
  additional_requirements?: string;
  job_location?: string;

  // Ahora usamos 'preguntas' como pide el ticket (opcional)
  preguntas?: PreguntaPayload[];
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
        `${CONFIG.apiUrl}/recruiter/job-postings/create`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        // Intentamos leer mensaje claro del backend
        let errMessage = 'Error al crear el puesto';
        try {
          const errData = await response.json();
          if (errData?.message) errMessage = errData.message;
          // Si el backend devuelve validaciones en otro formato, podríamos extraer aquí.
          // Ej: errData.errors -> construir mensaje legible.
        } catch (e) {
          // ignore parse error
        }
        throw new Error(errMessage);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? 'Error al crear el puesto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createJob, isSubmitting, error, success };
}
