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
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const acceptedApplications = applications.filter(app => app.status === 'accepted').length;

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CVision</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Panel de Candidato</span>
              <span className="text-gray-500">|</span>
              <button 
                className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                onClick={() => navigate('/perfil-applicant')}
              >
                <UserIcon className="w-6 h-6 text-teal-600" />
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </button>
              <button 
                className="flex items-center space-x-2 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors group"
                onClick={handleLogout}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-600 group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-sm font-medium text-red-600">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Hola! 👋</h1>
          <p className="text-gray-600">Bienvenido a tu panel de candidato. Aquí puedes gestionar tus postulaciones y encontrar nuevas oportunidades.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Postulaciones</p>
                <p className="text-2xl font-bold text-gray-900">{totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">{pendingApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aceptadas</p>
                <p className="text-2xl font-bold text-gray-900">{acceptedApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Buscar Trabajos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <BriefcaseIcon className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Buscar Trabajos</h3>
                <p className="text-gray-600 text-sm mb-4">Explora las últimas ofertas de trabajo disponibles</p>
                <button
                  className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                  onClick={() => navigate('/applicant/positions')}
                >
                  Ver Ofertas
                </button>
              </div>
            </div>
          </div>

          {/* Mis Postulaciones */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <ClipboardDocumentListIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mis Postulaciones</h3>
                <p className="text-gray-600 text-sm mb-4">Revisa el estado de tus postulaciones</p>
                <button
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
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