import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon, ArrowRightOnRectangleIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // La navbar ahora se muestra en todas las páginas
  // if (location.pathname === '/login' || location.pathname === '/register') {
  //   return null;
  // }

  // Mostrar login/signup solo en Home y solo si NO está autenticado
  const showAuthButtons = location.pathname === '/' && !isAuthenticated;

  const handleLogoClick = () => {
    if (user?.role === 'applicant') {
      navigate('/applicant/dashboard');
    } else if (user?.role === 'recruiter') {
      navigate('/recruiter/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    navigate('/');
  };
  
  const userRole = user?.role === 'applicant' ? 'Aplicante' : 'Reclutador';
  const roleColor = user?.role === 'applicant' ? 'blue' : 'green';

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg border-b border-blue-500/20">
      <div className="px-6 py-4 flex items-center w-full">
        {/* Badge de usuario al extremo izquierdo */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-2 font-semibold text-base text-white mr-8">
            <UserIcon className="h-5 w-5 text-white" />
            <span className="text-white font-medium text-sm capitalize">
              <strong>{userRole}</strong>
            </span>
            <div className={`w-2 h-2 rounded-full bg-${roleColor}-400 animate-pulse`}></div>
          </div>
        )}
        {/* Logo CVision y accesos rápidos a la izquierda */}
        <div className="flex items-center gap-4 ml-8">
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <SparklesIcon className="h-8 w-8 text-white group-hover:text-yellow-300 transition-colors duration-300" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-white transition-all duration-300">
              CVision
            </h1>
          </div>
          {isAuthenticated && user && user?.role === 'recruiter' && (
            <>
              <button onClick={() => navigate('/recruiter/create-job')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold">
                Crear puesto
              </button>
            </>
          )}
          {isAuthenticated && user && user?.role === 'applicant' && (
            <button onClick={() => navigate('/applicant/positions')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold">
              Buscar puestos
            </button>
          )}
        </div>
        {/* Espacio flexible */}
        <div className="flex-1" />
        {/* Botón Mi perfil a la derecha, antes de cerrar sesión */}
        {isAuthenticated && user && (
          <div className="flex items-center ml-4">
            <button onClick={() => navigate(user?.role === 'applicant' ? '/perfil-applicant' : '/perfil-reclutador')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold">
              Mi perfil
            </button>
          </div>
        )}
        {/* Derecha: Logout Button completamente alineado */}
        {isAuthenticated && user && (
          <div className="flex-shrink-0 ml-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg font-semibold text-base group"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        )}
        {/* Login/Signup buttons solo en Home y solo si no está autenticado */}
        {showAuthButtons && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg group font-semibold"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              Iniciar sesión
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg group font-semibold"
            >
              <UserIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Registrarse
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export const NavbarComponent = Navbar;