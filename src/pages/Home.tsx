import { SparklesIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import resultsImg from '../assets/homepage_results.png';
import candidatesImg from '../assets/homepage_candidates.png';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full gap-8 md:gap-0 overflow-visible">
        {/* Main message centrado */}
        <div className="flex flex-col items-center justify-center w-full px-2 md:px-8 py-16">
          <SparklesIcon className="h-12 w-12 text-indigo-600 mb-4" />
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 text-center">
            Bienvenido a <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">CVision</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 font-medium max-w-xl text-center">
            Tu plataforma de reclutamiento inteligente que revoluciona la forma de encontrar y evaluar talento
          </p>
          <Link
            to="/candidate/positions"
            className="mt-6 bg-indigo-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition text-lg"
          >
            Explorar Trabajos
          </Link>
        </div>
      </div>

      {/* Secciones informativas al hacer scroll */}
      <div className="w-full flex flex-col items-center justify-center mt-24 space-y-16 px-4">
        {/* Sección: Análisis inteligente con imagen a la izquierda y texto a la derecha */}
        <div className="w-full flex flex-row items-center justify-start gap-6 ml-0 md:ml-16">
          {/* Imagen a la izquierda */}
          <div className="flex items-center justify-center">
            <img
              src={resultsImg}
              alt="Resultados de análisis"
              className="object-contain max-w-xl w-full h-auto drop-shadow-2xl"
              style={{ background: 'none', border: 'none' }}
            />
          </div>
          {/* Línea punteada horizontal centrada */}
          <div className="flex items-center h-full transition-all duration-300 hover:drop-shadow-lg">
            <div className="w-40 h-0 border-t-4 border-dashed border-blue-300 opacity-80 mx-2" />
          </div>
          {/* Rectángulo de texto a la derecha */}
          <section className="inline-flex flex-col items-center justify-center gap-4 animate-fadein bg-gradient-to-br from-blue-100/90 via-indigo-100/80 to-purple-100/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-200 px-10 py-10 ml-0 md:ml-16 transition-transform duration-300 hover:shadow-3xl hover:scale-105">
            <ChartBarIcon className="h-20 w-20 text-blue-500 mb-6 drop-shadow" />
            <h2 className="text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">Análisis inteligente</h2>
            <p className="text-2xl text-gray-700 mb-2">Evaluación automática de CVs con IA avanzada.</p>
          </section>
          {/* Frase inspiradora a la derecha */}
          <div className="hidden md:flex flex-col items-start justify-center flex-1 pl-8 mt-32">
            <span className="text-3xl font-bold text-indigo-300 mb-2">Optimiza tu proceso de selección</span>
            <span className="text-xl text-indigo-200 ml-2">con IA</span>
          </div>
        </div>
        {/* Separador */}
        <div className="w-32 h-1 bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 rounded-full opacity-40 mb-6" />
        {/* Sección: Gestión de candidatos con rectángulo, línea punteada e imagen */}
        <div className="w-full flex flex-row items-center justify-end gap-6 mr-0 md:mr-16">
          {/* Frase inspiradora a la izquierda */}
          <div className="hidden md:flex flex-col items-end justify-start flex-1 pr-8 mt-20 mb-auto">
            <span className="text-3xl font-bold text-indigo-300 mb-2">Encuentra el mejor talento</span>
            <span className="text-xl text-indigo-200">en segundos</span>
          </div>
          <section className="inline-flex flex-col items-center justify-center gap-4 animate-fadein bg-gradient-to-br from-indigo-100/90 via-purple-100/80 to-blue-100/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-200 px-10 py-10 ml-0 md:ml-16 transition-transform duration-300 hover:shadow-3xl hover:scale-105">
            <UserGroupIcon className="h-20 w-20 text-indigo-500 mb-6 drop-shadow" />
            <h2 className="text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">Gestión de candidatos</h2>
            <p className="text-2xl text-gray-700 mb-2">Organiza y evalúa candidatos de manera eficiente.</p>
          </section>
          {/* Línea punteada horizontal entre el rectángulo y la imagen */}
          <div className="flex items-center h-full transition-all duration-300 hover:drop-shadow-lg">
            <div className="w-40 h-0 border-t-4 border-dashed border-indigo-300 opacity-80 mx-2" />
          </div>
          {/* Imagen a la derecha del rectángulo y la línea */}
          <div className="flex items-center justify-center">
            <img
              src={candidatesImg}
              alt="Gestión de candidatos"
              className="object-contain max-w-md w-full h-auto drop-shadow-2xl"
              style={{ background: 'none', border: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Footer simple con línea y textos */}
      <div className="w-full flex flex-col items-center mt-32 mb-8">
        <div className="w-2/3 h-1 bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 rounded-full opacity-40 mb-6" />
        <div className="flex flex-wrap gap-8 justify-center text-gray-500 text-lg font-medium">
          <span>Sobre nosotros</span>
          <span>Centro de ayuda</span>
          <span>Contacto</span>
          <span>Términos y condiciones</span>
          <span>Privacidad</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
