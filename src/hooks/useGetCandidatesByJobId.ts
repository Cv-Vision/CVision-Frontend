import { useEffect, useState } from 'react';

export interface Candidate {
  id: string;
  fullName: string;
  score: number;
  cvUrl: string;
  valoracion?: string; // Valoración del candidato
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedFeedback: string;
  };
}

// Cambia esto por el nombre real de tu bucket si es diferente
const S3_BUCKET = 'cv-bucket';
const S3_BASE_URL = `https://${S3_BUCKET}.s3.amazonaws.com/`;

export const useGetCandidatesByJobId = (jobId: string) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    setIsLoading(true);
    setError(null);

    // Obtener el idToken de sessionStorage
    const idToken = sessionStorage.getItem('idToken');
    if (!idToken) {
      setError('No autenticado');
      setIsLoading(false);
      return;
    }

    fetch(`https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/job-postings/${jobId}/candidates`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Error al obtener candidatos');
        const data = await res.json();
        // Mapear los candidatos al formato esperado
        const mappedCandidates: Candidate[] = (data.candidates || []).map((item: any) => ({
          id: item.cv_id,
          fullName: item.name || '',
          score: item.score ?? 0,
          cvUrl: item.cv_s3_key ? `${S3_BASE_URL}${item.cv_s3_key}` : '',
          valoracion: item.Valoracion ?? undefined,
          analysis: {
            strengths: [],
            weaknesses: [],
            recommendations: [],
            detailedFeedback: '',
          },
        }));
        // Ordenar de mayor a menor score
        mappedCandidates.sort((a, b) => b.score - a.score);
        setCandidates(mappedCandidates);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [jobId]);

  return { candidates, isLoading, error };
}; 