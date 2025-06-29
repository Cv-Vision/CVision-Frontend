import React, { useState } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '@/services/AuthService.ts';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidUsername = (username: string) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Letras, números y guiones bajos, 3-20 caracteres
    return usernameRegex.test(username);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isValidUsername(username)) {
      setError('El nombre de usuario solo puede contener letras, números y guiones bajos. De 3 a 20 caracteres.');
      setLoading(false);
      return;
    }

    try {
      await signUp({ username, email, password });
      navigate('/confirm', { state: { username } }); // Redirige y pasa username
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/20">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg mb-6">
            <UserPlusIcon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 text-center text-sm">
            Únete a nuestra plataforma de reclutamiento
          </p>
        </div>

        <form className="w-full flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">
              Tipo de usuario
            </label>
            <div className="relative">
              <select
                className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md appearance-none cursor-pointer pr-10"
                value={role}
                onChange={e => setRole(e.target.value as 'candidate' | 'recruiter')}
              >
                <option value="candidate" className="py-2">👤 Candidato</option>
                <option value="recruiter" className="py-2">🏢 Reclutador</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">
              Nombre de usuario
            </label>
            <input
              type="text"
              placeholder="tu_usuario"
              className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 ml-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Registrando...
              </div>
            ) : (
              'Crear Cuenta'
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <p className="text-gray-600 text-center text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
