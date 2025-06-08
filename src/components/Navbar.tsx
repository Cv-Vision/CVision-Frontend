import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

export function Navbar() {
  const { role, setRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('mockRole');
    setRole(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg rounded-b-2xl px-6 py-3 flex items-center justify-between w-full max-w-6xl mx-auto mt-4 mb-8">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-extrabold text-blue-500 tracking-tight">CVision</span>
      </Link>
      <div className="flex items-center gap-4">
        {!role && (
          <>
            <Link
              to="/login"
              className="flex items-center gap-1 bg-blue-400 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-600 transition-colors font-semibold"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" /> Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-1 bg-green-400 text-white px-4 py-2 rounded-xl shadow hover:bg-green-600 transition-colors font-semibold"
            >
              <UserCircleIcon className="h-5 w-5" /> Registrarse
            </Link>
          </>
        )}
        {role === 'candidate' && (
          <>
            <Link to="/candidate/dashboard" className="font-semibold text-blue-500 hover:underline">Panel</Link>
            <Link to="/perfil-candidato" className="font-semibold text-blue-500 hover:underline">Mi Perfil</Link>
            <Link to="/candidate/positions" className="font-semibold text-blue-500 hover:underline">Ofertas</Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl shadow hover:bg-gray-300 transition-colors font-semibold"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" /> Salir
            </button>
          </>
        )}
        {role === 'recruiter' && (
          <>
            <Link to="/recruiter/dashboard" className="font-semibold text-green-500 hover:underline">Panel</Link>
            <Link to="/perfil-reclutador" className="font-semibold text-green-500 hover:underline">Mi Perfil</Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl shadow hover:bg-gray-300 transition-colors font-semibold"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" /> Salir
            </button>
          </>
        )}
      </div>
    </nav>
  );
} 