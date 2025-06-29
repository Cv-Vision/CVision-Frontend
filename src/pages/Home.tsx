import { Link } from 'react-router-dom';
import { UserIcon, ArrowRightOnRectangleIcon, SparklesIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/solid';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full p-12 flex flex-col items-center border border-white/20">
        {/* Header with animated icon */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg animate-bounce">
            <SparklesIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
            Bienvenido a CVision
          </h1>
        </div>
        
        <p className="text-xl text-gray-700 mb-10 text-center max-w-2xl leading-relaxed">
          Tu plataforma de reclutamiento inteligente que revoluciona la forma de encontrar y evaluar talento
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Análisis Inteligente</h3>
            </div>
            <p className="text-sm text-gray-600">Evaluación automática de CVs con IA avanzada</p>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <UserGroupIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Gestión de Candidatos</h3>
            </div>
            <p className="text-sm text-gray-600">Organiza y evalúa candidatos de manera eficiente</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Resultados Precisos</h3>
            </div>
            <p className="text-sm text-gray-600">Evaluaciones detalladas y recomendaciones personalizadas</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <Link
            to="/login"
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg min-w-[200px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <ArrowRightOnRectangleIcon className="h-6 w-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10">Iniciar Sesión</span>
          </Link>
          
          <Link
            to="/register"
            className="group flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg min-w-[200px] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <UserIcon className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <span className="relative z-10">Registrarse</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
