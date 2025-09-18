import { useEffect, useState } from 'react';
import { getDashboardSummary } from '@/services/recruiterService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { UserIcon, BriefcaseIcon, UsersIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import BackButton from '@/components/other/BackButton';
import axios from "axios";

export default function RecruiterProfile() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<{ active_postings_count: number; applications_count: number } | null>(null);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');
    const [showToast, setShowToast] = useState(false);
    const { showToast: showGlobalToast } = useToast();

    useEffect(() => {
        document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    useEffect(() => {
        const token = user?.token;
        if (!token) {
            return;
        }
        getDashboardSummary(token)
            .then(setSummary)
            .catch(err => showGlobalToast(err.message, 'error'));
    }, [user]);

    useEffect(() => {
        const fetchAndSetProfile = async () => {
            const token = user?.token;
            let backendCompany = '';
            let backendEmail = '';
            let backendUsername = '';

            if (token) {
                try {
                    const res = await axios.get('http://localhost:8000/recruiter/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    backendCompany = res.data.company || '';
                    backendEmail = res.data.email || '';
                    backendUsername = res.data.name || '';
                } catch {
                    // Si falla el fetch, seguimos con los datos locales
                }
            }

            // Fallbacks locales
            const userEmail = user?.email || '';
            const userCompany = (user)?.company || '';
            const userUsername = (user)?.username || '';

            let sessionEmail = '';
            try {
                const raw = sessionStorage.getItem('user');
                if (raw) {
                    const parsed = JSON.parse(raw);
                    sessionEmail = parsed?.email || '';
                }
            } catch { /* noop */ }

            setCompany(backendCompany || userCompany);
            setEmail(backendEmail || userEmail || sessionEmail);
            setUsername(backendUsername || userUsername);

            if (!(backendUsername || userUsername) || !(backendCompany || userCompany)) {
                setShowToast(true);
                const t = setTimeout(() => setShowToast(false), 5000);
                return () => clearTimeout(t);
            }
        };
        fetchAndSetProfile();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = user?.token;
            if (!token) {
                showGlobalToast('No autenticado o token no disponible.', 'error');
                return;
            }

            await axios.post(
                'http://localhost:8000/recruiter/profile',
                {
                    email,
                    company,
                    position: '',
                    name: username
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            showGlobalToast('Perfil actualizado correctamente', 'success');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const errorMsg = err.response?.data?.error ||
                    err.response?.data?.message ||
                    'Error al actualizar el perfil';
                showGlobalToast(errorMsg, 'error');
            } else {
                showGlobalToast('Error al actualizar el perfil', 'error');
            }
        }
    };

    return (
        <div className="h-screen w-full bg-gradient-to-br from-blue-100 via-indigo-100 to-blue-200 flex items-stretch justify-center overflow-y-auto">
            {showToast && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50">
                    <span>⚠️ Algunos datos no están completos. Te recomendamos completarlos.</span>
                    <button onClick={() => setShowToast(false)} className="text-yellow-600 hover:text-yellow-800">
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            )}

            <div className="max-w-screen-xl w-full flex flex-col lg:flex-row bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 m-4">
                {/* Columna izquierda: Perfil y estadísticas */}
                <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8">
                    <div className="flex flex-col items-center gap-2">
                        <UserIcon className="h-20 w-20 text-blue-500 drop-shadow-lg bg-white rounded-full p-2 border-4 border-blue-200"/>
                        <h1 className="text-3xl font-extrabold text-blue-800 mt-2">{username || 'Nombre de usuario no disponible'}</h1>
                        <span className="text-sm text-gray-500">{email}</span>
                        <span className="text-sm text-indigo-700 font-semibold">{company}</span>
                    </div>
                    <div className="flex flex-col gap-6 w-full max-w-xs">
                        <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                            <BriefcaseIcon className="h-10 w-10 text-blue-600 mb-2"/>
                            <p className="text-4xl font-extrabold text-blue-800 mb-1">{summary?.active_postings_count ?? '--'}</p>
                            <p className="text-base text-blue-600 font-medium">Puestos activos</p>
                        </div>
                        <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                            <UsersIcon className="h-10 w-10 text-blue-600 mb-2"/>
                            <p className="text-4xl font-extrabold text-blue-800 mb-1">{summary?.applications_count ?? '--'}</p>
                            <p className="text-base text-blue-600 font-medium">Aplicaciones recibidas</p>
                        </div>
                    </div>
                </div>
                {/* Columna derecha: Formulario */}
                <div className="flex-1 flex flex-col justify-center p-8 bg-white/70 rounded-3xl">
                    <div className="w-full flex justify-start mb-6">
                        <BackButton/>
                    </div>
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        {/* Mensajes via toasts */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-blue-800">Nombre de usuario</label>
                            <input
                                type="text"
                                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg bg-gray-50 text-gray-700 pointer-events-none select-none"
                                value={username}
                                readOnly
                                tabIndex={-1}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-blue-800">Correo electrónico</label>
                            <input
                                type="email"
                                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg bg-gray-50 text-gray-700 pointer-events-none select-none"
                                value={email}
                                readOnly
                                tabIndex={-1}
                            />
                            {!email && (
                                <p className="text-sm text-orange-600">
                                    ⚠️ No se pudo cargar el email automáticamente. Por favor, ingrésalo manualmente.
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-blue-800">Empresa / Organización</label>
                            <input
                                type="text"
                                placeholder="Nombre de tu empresa"
                                className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                                value={company}
                                onChange={e => setCompany(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-2 hover:scale-105"
                        >
                            <CheckIcon className="h-5 w-5"/>
                            Guardar cambios
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}