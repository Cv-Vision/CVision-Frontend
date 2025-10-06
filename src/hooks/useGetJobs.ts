import { useState, useCallback } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import {Job} from "@/context/JobContext.tsx";
import { CONFIG } from '@/config';
import { useAuth } from '@/context/AuthContext';

// Custom hook for fetch + loading + error logic regarding job postings

export function useGetJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const { isAuthenticated } = useAuth();

    const loadJobs = useCallback(async (page: number = 1, size: number = 10, append = false) => {
        setLoading(true);
        setError(null);
        
        if (!isAuthenticated) {
            setJobs([]);
            setLoading(false);
            return;
        }

        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());
        const query = params.toString();

        try {
            const token = sessionStorage.getItem('idToken');
            const res = await fetchWithAuth(
                `${CONFIG.apiUrl}/job-postings?${query}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) {
            if (res.status === 400) {
                throw new Error('Parámetros inválidos de búsqueda');
            }
            throw new Error('Error buscando puestos');
            }
            const data = await res.json();

            const mappedJobs = data.job_postings.map((item: any) => ({
                pk:          item.posting_id || '',
                title:       item.title || '',
                description: item.description || '',
                company:     item.company || '', 
                status:      item.status || '',
                questions:   item.questions || [],
                experience_level: item.experience_level,
                english_level: item.english_level,
                contract_type: item.contract_type,
                country: item.country,
                province: item.province,
                city: item.city,
                industry_experience: item.industry_experience,
                additional_requirements: item.additional_requirements,
                modal: item.modal,
                created_at: item.created_at,
                updated_at: item.updated_at
            }));

            setJobs(prev => {
                if (append) {
                    if (mappedJobs.length > 0 && prev.find(job => job.pk === mappedJobs[0].pk)) {
                        return prev;
                    }
                    return [...prev, ...mappedJobs];
                }
                return mappedJobs;
            });
            setTotal(data.total);
            setHasMore(page < data.total_pages);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    return { jobs, isLoading, error, hasMore, total, refetch: loadJobs };
}
