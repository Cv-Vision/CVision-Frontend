import { useEffect, useState } from 'react';
import { getDashboardSummary } from '@/services/recruiterService';

// Ajusta la obtención del token según tu app (ejemplo: desde contexto)
const getToken = () => localStorage.getItem('access_token') || '';

export default function RecruiterProfile() {
    const [summary, setSummary] = useState<{ active_postings_count: number; applications_count: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            setError('No autenticado');
            return;
        }
        getDashboardSummary(token)
            .then(setSummary)
            .catch(err => setError(err.message));
    }, []);

    if (error) return <div>Error: {error}</div>;
    if (!summary) return <div>Cargando...</div>;

    return (
        <div>
            <h2>Mi Perfil (Reclutador)</h2>
            <div>Puestos activos: {summary.active_postings_count}</div>
            <div>Aplicaciones recibidas: {summary.applications_count}</div>
            {/* Agrega más datos si el endpoint los provee */}
        </div>
    );
}