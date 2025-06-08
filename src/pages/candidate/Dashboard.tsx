import { UserIcon, BriefcaseIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const CandidateDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-10 flex flex-col items-center">
        <UserIcon className="h-12 w-12 text-blue-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Panel de Candidato</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
          {/* Buscar Trabajos */}
          <div className="flex flex-col items-center bg-blue-50 rounded-xl p-6 shadow">
            <BriefcaseIcon className="h-8 w-8 text-blue-400 mb-2" />
            <h2 className="text-lg font-bold text-gray-800 mb-1">Buscar Trabajos</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Explora las últimas ofertas de trabajo disponibles</p>
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors font-semibold"
              onClick={() => navigate('/candidate/positions')}
            >
              Ver Ofertas
            </button>
          </div>
          {/* Mi Perfil */}
          <div className="flex flex-col items-center bg-blue-50 rounded-xl p-6 shadow">
            <UserIcon className="h-8 w-8 text-blue-400 mb-2" />
            <h2 className="text-lg font-bold text-gray-800 mb-1">Mi Perfil</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Actualiza tu información personal y profesional</p>
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors font-semibold"
              onClick={() => navigate('/perfil-candidato')}
            >
              Ver Perfil
            </button>
          </div>
          {/* Mis Postulaciones */}
          <div className="flex flex-col items-center bg-blue-50 rounded-xl p-6 shadow">
            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-400 mb-2" />
            <h2 className="text-lg font-bold text-gray-800 mb-1">Mis Postulaciones</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Revisa el estado de tus postulaciones</p>
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors font-semibold"
              onClick={() => navigate('/candidate/applications')}
            >
              Ver Postulaciones
            </button>
          </div>
        </div>
        <button
          className="bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl shadow hover:bg-blue-700 transition-colors text-lg mt-2"
          onClick={() => navigate('/candidate/positions')}
        >
          Ver posiciones disponibles
        </button>
      </div>
    </div>
  );
};

export default CandidateDashboard; 
