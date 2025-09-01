import { UserIcon, BriefcaseIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const ApplicantDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center py-10 px-2 overflow-hidden">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full p-10 flex flex-col items-center">
        <div className="relative mb-6">
          <UserIcon className="h-16 w-16 text-blue-600 mb-4" />
        </div>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-8 text-center">
          Panel de Aplicante
        </h1>
        
        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Buscar Trabajos */}
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
            <BriefcaseIcon className="h-8 w-8 text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300" />
            <h2 className="text-lg font-bold text-blue-800 mb-2 text-center">Buscar Trabajos</h2>
            <p className="text-blue-600 text-sm mb-6 text-center">Explora las últimas ofertas de trabajo disponibles</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105 group-hover:from-blue-600 group-hover:to-indigo-700"
              onClick={() => navigate('/applicant/positions')}
            >
              Ver Ofertas
            </button>
          </div>
          
          {/* Mi Perfil */}
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
            <UserIcon className="h-8 w-8 text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300" />
            <h2 className="text-lg font-bold text-blue-800 mb-2 text-center">Mi Perfil</h2>
            <p className="text-blue-600 text-sm mb-6 text-center">Actualiza tu información personal y profesional</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105 group-hover:from-blue-600 group-hover:to-indigo-700"
              onClick={() => navigate('/perfil-applicant')}
            >
              Ver Perfil
            </button>
          </div>
          
          {/* Mis Postulaciones */}
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300" />
            <h2 className="text-lg font-bold text-blue-800 mb-2 text-center">Mis Postulaciones</h2>
            <p className="text-blue-600 text-sm mb-6 text-center">Revisa el estado de tus postulaciones</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105 group-hover:from-blue-600 group-hover:to-indigo-700"
              onClick={() => navigate('/applicant/applications')}
            >
              Ver Postulaciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
