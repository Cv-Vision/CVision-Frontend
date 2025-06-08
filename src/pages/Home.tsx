import { Link } from 'react-router-dom';
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

const Home = () => {
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 text-center">Bienvenido a CVision</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Tu plataforma de reclutamiento inteligente</p>
        <div className="flex gap-6">
          <Link
            to="/login"
            className="flex items-center gap-2 bg-blue-400 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-blue-600 transition-colors text-lg"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" /> Iniciar Sesión
          </Link>
          <Link
            to="/register"
            className="flex items-center gap-2 bg-green-400 text-white font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-600 transition-colors text-lg"
          >
            <UserIcon className="h-6 w-6" /> Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
