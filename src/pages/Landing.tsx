import { ArrowRightIcon, CheckCircleIcon, ShieldCheckIcon, BoltIcon, UserGroupIcon, ChartBarIcon, BriefcaseIcon, InboxArrowDownIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';
import resultsImg from '../assets/homepage_results.png';
import Reveal from '@/components/Reveal';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative gradient blobs */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] bg-gradient-to-r from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 md:pt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <Reveal>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Reclutamiento inteligente con IA
            </h1>
            <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-xl">
              Encuentra, analiza y evalúa talento en minutos. Automatiza tareas repetitivas y toma mejores decisiones con insights accionables.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold"
              >
                Probar ahora
                <ArrowRightIcon className="h-5 w-5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm text-gray-800 px-6 py-3.5 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
              >
                Hablar con ventas
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="inline-flex items-center gap-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                Seguridad y privacidad integradas
              </div>
              <div className="inline-flex items-center gap-2">
                <BoltIcon className="h-5 w-5 text-yellow-600" />
                Resultados en segundos
              </div>
            </div>
          </Reveal>
          <div className="relative">
            <div className="bg-white/70 border border-white/50 backdrop-blur-sm rounded-3xl shadow-2xl p-4 animate-[float_6s_ease-in-out_infinite]">
              <img src={resultsImg} alt="Resultados de análisis" className="rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Logos / trust removed */}

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Reveal delayMs={0} className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow">
            <ChartBarIcon className="h-8 w-8 text-blue-600" />
            <h3 className="mt-3 text-xl font-bold text-gray-900">Análisis de CV con IA</h3>
            <p className="mt-2 text-gray-600">Extrae habilidades, experiencia y ajuste al puesto automáticamente.</p>
          </Reveal>
          <Reveal delayMs={150} className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow">
            <UserGroupIcon className="h-8 w-8 text-indigo-600" />
            <h3 className="mt-3 text-xl font-bold text-gray-900">Gestión de candidatos</h3>
            <p className="mt-2 text-gray-600">Centraliza perfiles, comentarios y estados en un solo lugar.</p>
          </Reveal>
          <Reveal delayMs={300} className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6 shadow">
            <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            <h3 className="mt-3 text-xl font-bold text-gray-900">Seguridad y cumplimiento</h3>
            <p className="mt-2 text-gray-600">Protección de datos y controles de acceso por rol.</p>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        <Reveal>
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">Cómo funciona</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Reveal delayMs={0} className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow flex flex-col items-center text-center">
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
              <BriefcaseIcon className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">1. Publica tu puesto</h3>
            <p className="mt-2 text-gray-600">Define requisitos y habilidades clave.</p>
          </Reveal>
          <Reveal delayMs={150} className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow flex flex-col items-center text-center">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
              <InboxArrowDownIcon className="h-16 w-16 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">2. Sube CVs</h3>
            <p className="mt-2 text-gray-600">Importa currículums o recibe postulaciones.</p>
          </Reveal>
          <Reveal delayMs={300} className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 shadow flex flex-col items-center text-center">
            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-blue-50 p-6">
              <ClipboardDocumentCheckIcon className="h-16 w-16 text-purple-600" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">3. Obtén resultados</h3>
            <p className="mt-2 text-gray-600">Ranking, insights y recomendaciones inmediatas.</p>
          </Reveal>
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        <Reveal>
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white">Empieza hoy gratis</h3>
              <p className="text-indigo-100 mt-1">Crea tu cuenta y acelera tu contratación.</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-indigo-100/90">
                <span className="inline-flex items-center gap-1"><CheckCircleIcon className="h-4 w-4" /> Sin tarjeta</span>
                <span className="inline-flex items-center gap-1"><CheckCircleIcon className="h-4 w-4" /> Plan gratuito</span>
                <span className="inline-flex items-center gap-1"><CheckCircleIcon className="h-4 w-4" /> Cancela cuando quieras</span>
              </div>
            </div>
            <a
              href="/register"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
            >
              Crear cuenta
              <ArrowRightIcon className="h-5 w-5" />
            </a>
          </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="border-t border-gray-200/70 pt-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-600">
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Producto</h4>
            <ul className="space-y-2">
              <li>Características</li>
              <li>Precios</li>
              <li>Roadmap</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Compañía</h4>
            <ul className="space-y-2">
              <li>Sobre nosotros</li>
              <li>Contacto</li>
              <li>Prensa</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Recursos</h4>
            <ul className="space-y-2">
              <li>Centro de ayuda</li>
              <li>Docs</li>
              <li>Guías</li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li>Términos</li>
              <li>Privacidad</li>
              <li>Seguridad</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;


