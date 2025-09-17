import { useEffect, useState } from 'react';

export interface Application {
    id: string;
    status: string;
    createdAt?: string;
    jobPosting: {
        title: string;
        company: string;
        description?: string;
        location?: string;
    };
}

export function useUserApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:8000/applications', {
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
                    // Mapeo de los datos del backend a la interfaz Application
                    setApplications(
                        data.map((app: any) => ({
                            id: app.application_id,
                            status: app.status,
                            createdAt: app.created_at,
                            jobPosting: {
                                title: app.job_posting?.title || '',
                                company: app.job_posting?.company || '',
                                description: app.job_posting?.description || '',
                                location: app.job_posting?.location || '',
                            },
                        }))
                    );
                }
            })
            .catch(() => setError('Error de red'))
            .finally(() => setLoading(false));
    }, []);

    return { applications, loading, error };
}