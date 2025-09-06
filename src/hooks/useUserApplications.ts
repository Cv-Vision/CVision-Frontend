import { useEffect, useState } from 'react';

export interface Application {
    id: number;
    position: string;
    status: string;
    // Agregá los campos que devuelve tu backend
}

export function useUserApplications() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/applications', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setApplications(data))
            .finally(() => setLoading(false));
    }, []);

    return { applications, loading };
}