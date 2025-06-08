import { UserIcon, BriefcaseIcon, UsersIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-10 flex flex-col items-center">
        <UserIcon className="h-12 w-12 text-green-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">Panel de Reclutador</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
          {/* Crear Puesto */}
          <div className="flex flex-col items-center bg-green-50 rounded-xl p-6 shadow">
            <BriefcaseIcon className="h-8 w-8 text-green-400 mb-2" />
            <h2 className="text-lg font-bold text-gray-800 mb-1">Crear Puesto</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Publica una nueva oferta de trabajo</p>
            <button
              className="bg-green-400 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors font-semibold"
              onClick={() => navigate('/recruiter/create-job')}
            >
              Crear Puesto
            </button>
          </div>
          {/* Ver Candidatos */}
          <div className="flex flex-col items-center bg-green-50 rounded-xl p-6 shadow">
            <UsersIcon className="h-8 w-8 text-green-400 mb-2" />
            <h2 className="text-lg font-bold text-gray-800 mb-1">Ver Candidatos</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Revisa los candidatos que han aplicado</p>
            <button
              className="bg-green-400 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors font-semibold"
              onClick={() => navigate('/recruiter/candidates')}
            >
              Ver Candidatos
            </button>
          </div>
          {/* Mi Perfil */}
          <div className="flex flex-col items-center bg-green-50 rounded-xl p-6 shadow">
            <UserIcon className="h-8 w-8 text-green-400 mb-2" />
            <h2 className="text-lg font-bold text-gray-800 mb-1">Mi Perfil</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Actualiza tu información personal y de empresa</p>
            <button
              className="bg-green-400 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors font-semibold"
              onClick={() => navigate('/perfil-reclutador')}
            >
              Ver Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard; 
