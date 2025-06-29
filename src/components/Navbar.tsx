import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserIcon, ArrowRightOnRectangleIcon, SparklesIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Ocultar navbar en login y register
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogoClick = () => {
    if (user?.role === 'candidate') {
      navigate('/candidate/dashboard');
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
    navigate('/login');
  };
  
  const userRole = user?.role === 'candidate' ? 'Candidato' : 'Reclutador';
  const roleColor = user?.role === 'candidate' ? 'blue' : 'green';

  return (
    <header className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-lg border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div 
          onClick={handleLogoClick}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <SparklesIcon className="h-8 w-8 text-white group-hover:text-yellow-300 transition-colors duration-300" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-white transition-all duration-300">
            CVision
          </h1>
        </div>

        {/* User Info and Logout */}
        {isAuthenticated && user && (
          <div className="flex items-center gap-6">
            {/* User Role Badge */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <UserIcon className="h-5 w-5 text-white" />
              <span className="text-white font-medium text-sm capitalize">
                {userRole}
              </span>
              <div className={`w-2 h-2 rounded-full bg-${roleColor}-400 animate-pulse`}></div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium text-sm">Cerrar sesión</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export const NavbarComponent = Navbar;