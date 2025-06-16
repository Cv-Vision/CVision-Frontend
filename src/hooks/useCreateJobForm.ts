import { useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export function useCreateJobForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createJob = async ({ title, description }: { title: string; description: string }) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const token = sessionStorage.getItem('idToken');
      if (!token) throw new Error('No hay token de sesión');

      const response = await fetchWithAuth('https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/job', {
        method: 'POST',
        body: JSON.stringify({ title, description }),
        headers: { Authorization: `Bearer ${token}` }
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
