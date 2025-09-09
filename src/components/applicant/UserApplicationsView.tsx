import { BriefcaseIcon } from '@heroicons/react/24/outline';
import { useUserApplications } from '../../hooks/useUserApplications';

function traducirEstado(status: string) {
    switch (status) {
        case 'Pending':
            return 'Pendiente';
        case 'Accepted':
            return 'Aceptada';
        case 'Rejected':
            return 'Rechazada';
        default:
            return status;
    }
}

export function UserApplicationsView() {
    const { applications, loading, error } = useUserApplications();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center py-10 px-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full p-10 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                        <BriefcaseIcon className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                        Mis Postulaciones
                    </h2>
                </div>
                {loading ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-blue-700 font-medium">Cargando tus postulaciones...</span>
                    </div>
                ) : error ? (
                    <div className="text-red-600 font-semibold py-10">{error}</div>
                ) : applications.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-10">
                        <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                            <BriefcaseIcon className="h-12 w-12 text-blue-600" />
                        </div>
                        <p className="text-lg text-gray-700 font-semibold">No tienes postulaciones.</p>
                        <p className="text-gray-500 text-sm">Cuando te postules a un puesto, aparecerá aquí.</p>
                    </div>
                ) : (
                    <ul className="w-full space-y-4">
                        {applications.map(app => (
                            <li
                                key={app.id}
                                className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-5 shadow hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-blue-800">{app.jobPosting.title}</h3>
                                        {app.jobPosting.company && (
                                            <p className="text-sm text-gray-600">Compañía: {app.jobPosting.company}</p>
                                        )}
                                        {app.createdAt && (
                                            <p className="text-sm text-gray-500">
                                                Fecha: {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        )}
                                        {app.jobPosting.description && (
                                            <p className="text-sm text-gray-700 mt-2">{app.jobPosting.description}</p>
                                        )}
                                        {app.jobPosting.location && (
                                            <p className="text-sm text-gray-500">Ubicación: {app.jobPosting.location}</p>
                                        )}
                                    </div>
                                    <div className="text-sm text-blue-600 mt-2 md:mt-0">
                                        Estado: <span className="font-semibold">{traducirEstado(app.status) || 'Pendiente'}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}