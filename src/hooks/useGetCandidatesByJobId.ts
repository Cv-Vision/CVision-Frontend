import { CONFIG } from '@/config';
import { useEffect, useState } from 'react';

export interface Candidate {
  id: string;
  fullName: string;
  score: number | null;
  cvId: string;
  rating?: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedFeedback: string;
  };
}

const S3_BASE_URL = `${CONFIG.bucketUrl}`;

export const useGetCandidatesByJobId = (jobId: string) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async (skipLoading = false) => {
    if (!skipLoading) {
      setIsLoading(true);
      setError(null);
    }

    const idToken = sessionStorage.getItem('idToken');
    if (!idToken) {
      setError('No autenticado');
      if (!skipLoading) setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${CONFIG.apiUrl}/recruiter/job-postings/${jobId}/candidates`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) throw new Error('Error al obtener candidatos');
      const data = await res.json();
      const mappedCandidates: Candidate[] = (data.candidates || []).map((item: any) => ({
        id: item.cv_id,
        fullName: item.name || '',
        score: item.score || null,
        cvUrl: item.cv_s3_key ? `${S3_BASE_URL}${item.cv_s3_key}` : '',
        rating: item.valoracion || '',
        analysis: {
          strengths: [],
          weaknesses: [],
          recommendations: [],
          detailedFeedback: '',
        },
      }));
      mappedCandidates.sort((a, b) => {
        if (a.score === null && b.score === null) return 0;
        if (a.score === null) return 1;
        if (b.score === null) return -1;
        return b.score - a.score;
      });
      setCandidates(mappedCandidates);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!skipLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;
    fetchCandidates(); // Solo fetch inicial, sin polling
  }, [jobId]);

  return { candidates, isLoading, error, refetch: fetchCandidates };
};
