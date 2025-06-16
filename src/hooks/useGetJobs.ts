import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import {Job} from "@/context/JobContext.tsx";

// Custom hook for fetch + loading + error logic regarding job postings

export function useGetJobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const token = sessionStorage.getItem('idToken');
                if (!token) throw new Error('Necesitas iniciar sesión');
                const res = await fetchWithAuth(
                    'https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/job-postings',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (!res.ok) throw new Error('Error cargando puestos');
                
                
                const raw = (await res.json()) as any[];
                const mappedJobs = raw.map(item => ({
                    id:          item.pk.split('#')[1],    // p.ej. "ba417f42-8640-4dcb-b335-9b248f2972ce"
                    title:       item.title,
                    description: item.description,
                    company:     item.company ?? '', // si tu API lo trae
                    status:      item.status,       // número
                    questions:   item.questions ?? [] 
                }));
                setJobs(mappedJobs);
                
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { jobs, isLoading, error };
}
