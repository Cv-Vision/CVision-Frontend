import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

export interface Applicant {
    cv_id: string;
    name: string;
    cv_s3_key: string;
    created_at: string;
}

// Hook to fetch Applicants for a specific job posting
// Returns an object with Applicants, loading state, and error message
// Applicant has cv_id, name, cv_s3_key, and created_at fields
export function useGetApplicants(jobId: string) {
    const [Applicants, setApplicants] = useState<Applicant[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) {
            setError('Falta el jobId');
            setApplicants([]);
            return;
        }

        const loadApplicants = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = sessionStorage.getItem('idToken');
                if (!token) throw new Error('No autenticado');
                const res = await fetchWithAuth(
                    `${CONFIG.apiUrl}/recruiter/job-postings/${jobId}/Applicants`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) {
                    if (res.status === 401) throw new Error('No autenticado');
                    if (res.status === 400) throw new Error('Falta parámetro job_id');
                    throw new Error('Error en el servidor');
                }
                const data = await res.json();
                setApplicants(data.Applicants);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                setApplicants([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadApplicants();
    }, [jobId]);

    return { Applicants, isLoading, error };
}

