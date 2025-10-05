import { useEffect, useState } from 'react';
import { getDashboardSummary } from '@/services/recruiterService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { BriefcaseIcon, UsersIcon } from '@heroicons/react/24/solid';
import BackButton from '@/components/other/BackButton';
import { ProfileCard } from '@/components/rebranding/profile/ProfileCard';
import { useUpdateRecruiterProfile, RecruiterProfileData } from '@/hooks/useUpdateRecruiterProfile';
import { useGetRecruiterProfile } from '@/hooks/useGetRecruiterProfile';

export default function RecruiterProfile() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<{ active_postings_count: number; applications_count: number } | null>(null);
    const { showToast: showGlobalToast } = useToast();
    const { updateProfile, success: updateSuccess, error: updateError } = useUpdateRecruiterProfile();
    const { profile: backendProfile, loading: profileLoading, error: profileError, refetch: refetchProfile } = useGetRecruiterProfile();

    // Estado del perfil
    const [profileData, setProfileData] = useState<RecruiterProfileData>({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        company: '',
        position: '',
        bio: '',
        avatarUrl: undefined,
    });

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

    // Efecto para cargar los datos del perfil cuando se obtienen del backend
    useEffect(() => {
        if (backendProfile) {
            setProfileData(prev => ({
                ...prev,
                fullName: backendProfile.name || '',
                email: backendProfile.email || '',
                company: backendProfile.company || '',
                position: backendProfile.position || '',
                phone: '', // No disponible en el backend actualmente
                location: '', // No disponible en el backend actualmente
                bio: '', // No disponible en el backend actualmente
            }));
        } else if (user && !profileLoading) {
            // Fallback a datos del usuario local si no hay perfil del backend
            setProfileData(prev => ({
                ...prev,
                fullName: user.username || '',
                email: user.email || '',
                company: user.company || '',
                position: '',
                phone: '',
                location: '',
                bio: '',
            }));
        }
    }, [backendProfile, user, profileLoading]);

    const handleProfileSave = async (data: RecruiterProfileData) => {
        try {
            await updateProfile(data);
            setProfileData(data);
            // Refrescar los datos del perfil desde el backend
            await refetchProfile();
        } catch (err) {
            showGlobalToast('Error al actualizar el perfil', 'error');
        }
    };

    // Efecto para manejar el éxito de la actualización
    useEffect(() => {
        if (updateSuccess) {
            showGlobalToast('Perfil actualizado correctamente', 'success');
        }
    }, [updateSuccess, showGlobalToast]);

    // Efecto para manejar errores de actualización
    useEffect(() => {
        if (updateError) {
            showGlobalToast(updateError, 'error');
        }
    }, [updateError, showGlobalToast]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <BackButton />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Columna izquierda: Estadísticas */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <BriefcaseIcon className="h-8 w-8 text-blue-600"/>
                                        <div>
                                            <p className="text-sm text-gray-600">Puestos Activos</p>
                                            <p className="text-2xl font-bold text-blue-800">{summary?.active_postings_count ?? '--'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <UsersIcon className="h-8 w-8 text-green-600"/>
                                        <div>
                                            <p className="text-sm text-gray-600">Aplicaciones</p>
                                            <p className="text-2xl font-bold text-green-800">{summary?.applications_count ?? '--'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha: Perfil */}
                    <div className="lg:col-span-2">
                        {profileLoading ? (
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <div className="flex items-center justify-center py-8">
                                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                    <span className="ml-3 text-gray-600">Cargando perfil...</span>
                                </div>
                            </div>
                        ) : profileError ? (
                            <div className="bg-white rounded-2xl shadow-md p-6">
                                <div className="text-center py-8">
                                    <p className="text-red-600 mb-4">Error al cargar el perfil: {profileError}</p>
                                    <button 
                                        onClick={refetchProfile}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Reintentar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <ProfileCard 
                                profile={profileData} 
                                onSave={handleProfileSave}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}