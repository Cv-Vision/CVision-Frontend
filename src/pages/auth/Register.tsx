import React, { useState } from 'react';
import { UserPlusIcon } from '@heroicons/react/24/solid';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula registro: guarda el rol en localStorage
    localStorage.setItem('mockRole', role);
    if (role === 'candidate') {
      navigate('/candidate/dashboard');
    } else {
      navigate('/recruiter/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-10 flex flex-col items-center">
        <UserPlusIcon className="h-12 w-12 text-green-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 text-center">Crear Cuenta</h1>
        <form className="w-full flex flex-col gap-6 mt-6" onSubmit={handleSubmit}>
          <select
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={role}
            onChange={e => setRole(e.target.value as 'candidate' | 'recruiter')}
          >
            <option value="candidate">Candidato</option>
            <option value="recruiter">Reclutador</option>
          </select>
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-400 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-600 transition-colors text-lg"
          >
            Registrarse
          </button>
        </form>
        <p className="mt-6 text-gray-600 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-green-500 hover:underline font-semibold">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 
