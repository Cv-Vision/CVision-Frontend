import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export interface Candidate {
    cv_id: string;
    name: string;
    cv_s3_key: string;
    created_at: string;
}

// Hook to fetch candidates for a specific job posting
// Returns an object with candidates, loading state, and error message
// Candidate has cv_id, name, cv_s3_key, and created_at fields
export function useGetCandidates(jobId: string) {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) {
            setError('Falta el jobId');
            setCandidates([]);
            return;
        }

        const loadCandidates = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = sessionStorage.getItem('idToken');
                if (!token) throw new Error('No autenticado');
                const res = await fetchWithAuth(
                    `${process.env.REACT_APP_API_URL}/recruiter/job-postings/${jobId}/candidates`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) {
                    if (res.status === 401) throw new Error('No autenticado');
                    if (res.status === 400) throw new Error('Falta parámetro job_id');
                    throw new Error('Error en el servidor');
                }
                const data = await res.json();
                setCandidates(data.candidates);
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

