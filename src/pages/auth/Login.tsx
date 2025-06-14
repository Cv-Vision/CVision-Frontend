import React, { useState } from 'react';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '@/services/AuthService.ts';
import { useAuth } from "@/context/AuthContext.tsx";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn({ username: email, password });
      const userData = { email, role };
      if (login) {
        login(userData);
      }

      if (role === 'candidate') {
        navigate('/candidate/dashboard');
      } else {
        navigate('/recruiter/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10 flex flex-col items-center">
        <ArrowRightOnRectangleIcon className="h-12 w-12 text-blue-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">Iniciar Sesión</h1>
        <form className="w-full flex flex-col gap-6 mt-6" onSubmit={handleSubmit}>
          <select
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={role}
            onChange={e => setRole(e.target.value as 'candidate' | 'recruiter')}
          >
            <option value="candidate">Candidato</option>
            <option value="recruiter">Reclutador</option>
          </select>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-400 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-600 transition-colors text-lg"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
        <p className="mt-6 text-gray-600 text-center">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-blue-500 hover:underline font-semibold">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
