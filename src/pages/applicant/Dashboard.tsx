import { UserIcon, BriefcaseIcon, ClipboardDocumentListIcon, ChartBarIcon } from '@heroicons/react/24/solid';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useUserApplications } from '@/hooks/useUserApplications';
import { useAuth } from '@/context/AuthContext';

const ApplicantDashboard = () => {
  const navigate = useNavigate();
  const { applications } = useUserApplications();
  const { user, logout } = useAuth();

  // Calculate basic stats
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending' || app.status === 'PENDING').length;
  const acceptedApplications = applications.filter(app => app.status === 'accepted').length;

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 grid place-items-center shadow-sm">
                <span className="text-white font-bold text-xs">CV</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900">Bienvenido de vuelta</span>
                <span className="text-xs text-gray-500">Gestiona tus postulaciones y descubre nuevas oportunidades</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => navigate('/perfil-applicant')}
              >
                <UserIcon className="w-5 h-5 text-teal-600" />
                <span className="text-sm">{user?.email}</span>
              </button>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <div className="absolute right-4 top-4">
              <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">Total</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-50">
                <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Postulaciones</p>
                <p className="text-3xl font-bold text-gray-900">{totalApplications}</p>
              </div>
            </div>
          </div>

          {/* En Proceso */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <div className="absolute right-4 top-4">
              <span className="text-[10px] uppercase tracking-wide text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">Activas</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-yellow-50">
                <ChartBarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En Proceso</p>
                <p className="text-3xl font-bold text-gray-900">{pendingApplications}</p>
              </div>
            </div>
          </div>

          {/* Aceptadas */}
          <div className="relative rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <div className="absolute right-4 top-4">
              <span className="text-[10px] uppercase tracking-wide text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Éxito</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-50">
                <UserIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aceptadas</p>
                <p className="text-3xl font-bold text-gray-900">{acceptedApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Buscar Trabajos */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-indigo-50">
                <BriefcaseIcon className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Buscar Trabajos</h3>
                <p className="text-sm text-gray-600 mt-1">Explora las últimas ofertas de trabajo disponibles y encuentra tu próxima oportunidad profesional.</p>
                <button
                  className="mt-4 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  onClick={() => navigate('/applicant/positions')}
                >
                  Ver Ofertas
                </button>
              </div>
            </div>
          </div>

          {/* Mis Postulaciones */}
          <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-purple-50">
                <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Mis Postulaciones</h3>
                <p className="text-sm text-gray-600 mt-1">Revisa el estado de tus postulaciones y mantente al día con tus procesos.</p>
                <button
                  className="mt-4 w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  onClick={() => navigate('/mis-postulaciones')}
                >
                  Ver Postulaciones
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;