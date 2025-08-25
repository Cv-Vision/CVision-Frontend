import { useState, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import {Job} from "@/context/JobContext.tsx";

// Custom hook for fetch + loading + error logic regarding job postings

export function useGetJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadJobs = useCallback(async (skipLoading = false) => {
        if (!skipLoading) {
            setLoading(true);
            setError(null);
        }
        try {
            const token = sessionStorage.getItem('idToken');
            if (!token) throw new Error('Necesitas iniciar sesión');
            const res = await fetchWithAuth(
                `/api/job-postings`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) throw new Error('Error cargando puestos');
            
            
            const raw = (await res.json()) as any[];
            const mappedJobs = raw.map(item => ({
                pk:          item.posting_id,
                title:       item.title,
                description: item.description,
                company:     item.company ?? '',
                status:      item.status,
                experience_level: item.experience_level,
                english_level: item.english_level,
                contract_type: item.contract_type,
                location: item.location,
                industry_experience: item.industry_experience,
                additional_requirements: item.additional_requirements,
            }));
            setJobs(mappedJobs);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            if (!skipLoading) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        loadJobs();
    }, [loadJobs]);

    return { jobs, isLoading, error, refetch: loadJobs };
}
