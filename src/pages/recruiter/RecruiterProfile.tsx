import { useEffect, useState } from 'react';
import { getDashboardSummary } from '@/services/recruiterService';
import { useAuth } from '@/context/AuthContext';
import { UserIcon, BriefcaseIcon, UsersIcon } from '@heroicons/react/24/solid';

export default function RecruiterProfile() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<{ active_postings_count: number; applications_count: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = user?.token;
        if (!token) {
            setError('No autenticado o token no disponible.');
            return;
        }
        getDashboardSummary(token)
            .then(setSummary)
            .catch(err => setError(err.message));
    }, [user]);

    return (
        <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center py-10 px-2 overflow-hidden">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-xl w-full p-10 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-8">
                    <UserIcon className="h-12 w-12 text-blue-600" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center">
                        Mi Perfil
                    </h1>
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        Reclutador
                    </span>
                </div>
                {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl text-red-800 text-center w-full">
                        {error}
                    </div>
                )}
                {!summary && !error && (
                    <div className="flex flex-col items-center gap-3 py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 border-t-blue-600"></div>
                        <span className="text-blue-700 font-medium">Cargando datos...</span>
                    </div>
                )}
                {summary && (
                    <div className="w-full flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
                                <BriefcaseIcon className="h-8 w-8 text-blue-600 mb-2" />
                                <p className="text-3xl font-bold text-blue-800 mb-1">{summary.active_postings_count}</p>
                                <p className="text-sm text-blue-600 font-medium">Puestos activos</p>
                            </div>
                            <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
                                <UsersIcon className="h-8 w-8 text-blue-600 mb-2" />
                                <p className="text-3xl font-bold text-blue-800 mb-1">{summary.applications_count}</p>
                                <p className="text-sm text-blue-600 font-medium">Aplicaciones recibidas</p>
                            </div>
                        </div>
                        {/* Puedes agregar más datos aquí si el endpoint los provee */}
                    </div>
                )}
            </div>
        </div>
    );
}