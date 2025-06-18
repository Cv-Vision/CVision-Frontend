import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export interface Candidate {
  id: string;
  fullName: string;
  score: number;
  cvUrl: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedFeedback: string;
  };
}

export function useGetCandidatesByJobId(jobId: string) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const loadCandidates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchWithAuth(`/api/recruiter/job/${jobId}/candidates`);
        if (!response.ok) {
          if (response.status === 404) {
            // No candidates found
            setCandidates([]);
          } else {
            throw new Error('Error al cargar los candidatos');
          }
        } else {
          const data: Candidate[] = await response.json();
          setCandidates(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setCandidates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidates();
  }, [jobId]);

  return { candidates, isLoading, error };
}
