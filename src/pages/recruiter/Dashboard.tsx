import { UserIcon, BriefcaseIcon, UsersIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
// import { ProcessCVsButton } from '../../components/ProcessCVsButton.tsx'; parte del boton para procesar CVS.

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  // Aquí puedes definir el jobId y apiUrl si es necesario para el botón de procesar CVs, mas abajo esta la explicacion de por qué está comentado
  // const jobId = '934b732b-ab9f-4fd3-97d9-6e41fbe2089b'; // PONÉ TU JOB_ID REAL DE PRUEBA
  // const apiUrl = 'https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/cv-processor'; // PONÉ TU URL REAL DEL API


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
            <h2 className="text-lg font-bold text-gray-800 mb-1">Ver Puestos de Trabajo</h2>
            <p className="text-gray-600 text-sm mb-4 text-center">Revisa los puestos de trabajo que has publicado</p>
            <button
              className="bg-green-400 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors font-semibold"
              onClick={() => navigate('/recruiter/candidates')}
            >
              Ver Puestos de Trabajo
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

          {/*este botón es para procesar todos los CVs de un puesto específico, esta comentado porque no va en esta pantalla, hay que pasarla a la pantalla (una vez creada)*/}
          {/*donde estan los puestos de trabajo del reclutador, para poder mandar por job_id todos los cvs a procesar.*/}
        {/*  <div className="mt-8">*/}
        {/*  <h2 className="text-2xl font-bold mb-4">Procesar todos los CVs</h2>*/}
        {/*  <ProcessCVsButton jobId={jobId} apiUrl={apiUrl} />*/}
        {/*</div>*/}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard; 
