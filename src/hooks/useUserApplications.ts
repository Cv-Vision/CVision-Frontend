import { useEffect, useState } from 'react';
import { CONFIG } from '@/config';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export interface Application {
    id: string;
    status: string;
    createdAt?: string;
    jobPostingId: string;
    jobPosting: {
        title: string;
        company: string;
        description?: string;
        province?: string;
        city?: string;
    };
}

// Función para obtener detalles del job posting
const fetchJobDetails = async (jobId: string) => {
    try {
        const response = await fetchWithAuth(`${CONFIG.apiUrl}/job-postings/${jobId}/public`);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        // Silently handle errors, return null for missing job details
    }
    return null;
};

export function useUserApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${CONFIG.apiUrl}/applications`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${sessionStorage.getItem('idToken') || ''}`,
            },
        })
            .then(async res => {
                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    setError('Respuesta inesperada del servidor');
                    setApplications([]);
                    return;
                }
                const data = await res.json();
                if (!res.ok) {
                    setError(data.message || 'Error al obtener postulaciones');
                    setApplications([]);
                } else {
                    // Procesar las aplicaciones y obtener detalles completos de cada job
                    const processApplications = async () => {
                        const applicationsWithDetails = await Promise.all(
                            data.map(async (app: any) => {
                                // Obtener detalles completos del job posting
                                const jobDetails = await fetchJobDetails(app.job_posting_id);
                                
                                return {
                                    id: app.application_id,
                                    status: app.status,
                                    createdAt: app.created_at,
                                    jobPostingId: app.job_posting_id,
                                    jobPosting: {
                                        title: jobDetails?.title || 'Título no disponible',
                                        company: jobDetails?.company || 'Empresa no disponible',
                                        description: jobDetails?.description || '',
                                        province: jobDetails?.province || '',
                                        city: jobDetails?.city || '',
                                    },
                                };
                            })
                        );
                        
                        setApplications(applicationsWithDetails);
                    };
                    
                    processApplications();
                }
            })
            .catch(() => setError('Error de red'))
            .finally(() => setLoading(false));
    }, []);

    return { applications, loading, error };
}