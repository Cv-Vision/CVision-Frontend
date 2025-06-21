import { useState } from 'react';
export function useSetCandidateRating() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const setRating = async (jobId: string, cvId: string, valoracion: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = sessionStorage.getItem('idToken');
      if (!token) throw new Error('No autorizado - token ausente');

      const payload = { valoracion, cvId, jobId };
      console.log('📤 Enviando request a Lambda con payload:', payload);

      const res = await fetch(
        `https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/set_candidate_rating`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
          mode: 'cors',
          credentials: 'omit',
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('❌ Error en respuesta del backend:', data);
        throw new Error(data?.error || 'Error inesperado al actualizar valoración');
      }

      console.log('✅ Respuesta exitosa del backend');
      setSuccess(true);
    } catch (err) {
      console.error('❌ Error en setRating:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return { setRating, isLoading, error, success };
}
