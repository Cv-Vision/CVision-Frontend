import { UserIcon, BriefcaseIcon, UsersIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useGetJobs } from '@/hooks/useGetJobs';
import { useGetTotaApplicants } from '@/hooks/useGetTotaApplicants.ts';
import { useEffect } from 'react';
// import { ProcessCVsButton } from '../../components/ProcessCVsButton.tsx'; parte del boton para procesar CVS.

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const { jobs } = useGetJobs();
  const totalActiveJobs = jobs.filter(job => job.status === "ACTIVE").length;
  const { totalApplicants, isLoading: applicantsLoading } = useGetTotaApplicants();

  // Prevenir scroll en toda la página
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center py-10 px-2 overflow-hidden">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full p-10 flex flex-col items-center">
        <div className="relative mb-6">
          <UserIcon className="h-16 w-16 text-blue-600 mb-4" />
        </div>
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-8 text-center">
          Panel de Reclutador
        </h1>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-10">
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
            <div className="relative mb-4">
            </div>
            <p className="text-3xl font-bold text-blue-800 mb-2">{totalActiveJobs}</p>
            <p className="text-sm text-blue-600 font-medium">Publicaciones Activas</p>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
            <div className="relative mb-4">
            </div>
            <p className="text-3xl font-bold text-blue-800 mb-2">
              {applicantsLoading ? '...' : totalApplicants}
            </p>
            <p className="text-sm text-blue-600 font-medium">Cantidad de Aplicantes</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
            <BriefcaseIcon className="h-8 w-8 text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300" />
            <h2 className="text-lg font-bold text-blue-800 mb-2 text-center">Crear Puesto</h2>
            <p className="text-blue-600 text-sm mb-6 text-center">Publica una nueva oferta de trabajo</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105 group-hover:from-blue-600 group-hover:to-indigo-700"
              onClick={() => navigate('/recruiter/create-job')}
            >
              Crear Puesto
            </button>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
            <UsersIcon className="h-8 w-8 text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300" />
            <h2 className="text-lg font-bold text-blue-800 mb-2 text-center">Ver Puestos de Trabajo</h2>
            <p className="text-blue-600 text-sm mb-6 text-center">Revisa los puestos de trabajo que has publicado</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105 group-hover:from-blue-600 group-hover:to-indigo-700"
              onClick={() => navigate('/recruiter/job-postings')}
            >
              Ver Puestos de Trabajo
            </button>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100 hover:border-blue-200 group">
            <UserIcon className="h-8 w-8 text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300" />
            <h2 className="text-lg font-bold text-blue-800 mb-2 text-center">Mi Perfil</h2>
            <p className="text-blue-600 text-sm mb-6 text-center">Actualiza tu información personal y de empresa</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105 group-hover:from-blue-600 group-hover:to-indigo-700"
              onClick={() => navigate('/perfil-reclutador')}
            >
              Ver Perfil
            </button>
          </div>
        </div>

        {/*este botón es para procesar todos los CVs de un puesto específico, esta comentado porque no va en esta pantalla, hay que pasarla a la pantalla (una vez creada)*/}
        {/*donde estan los puestos de trabajo del reclutador, para poder mandar por job_id todos los cvs a procesar.*/}
        {/*  <div className="mt-8">*/}
        {/*  <h2 className="text-2xl font-bold mb-4">Procesar todos los CVs</h2>*/}
        {/*  <ProcessCVsButton jobId={jobId} apiUrl={apiUrl} />*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default RecruiterDashboard; 
