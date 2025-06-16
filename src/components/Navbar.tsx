import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


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
  console.log('isAuthenticated:', isAuthenticated);
  const userRole = user?.role === 'candidate' ? 'Candidato' : 'Reclutador';

  return (
    <header className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1
        onClick={handleLogoClick}
        className="text-xl font-bold text-blue-500 cursor-pointer"
      >
        CVision
      </h1>

      {isAuthenticated && user && (
        <div className="flex items-center gap-4">
          <span className="text-gray-700 text-sm capitalize">{userRole}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
};

export const NavbarComponent = Navbar;