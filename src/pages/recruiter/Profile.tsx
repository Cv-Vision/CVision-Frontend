import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon } from '@heroicons/react/24/solid';
import BackButton from '@/components/BackButton';

export function RecruiterProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState(user?.company || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-10 flex flex-col items-center">
        <div className="w-full flex justify-start mb-4">
          <BackButton />
        </div>
        <UserIcon className="h-12 w-12 text-green-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">Mi Perfil (Reclutador)</h1>
        <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
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
            type="text"
            placeholder="Empresa / Organización"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-400 text-white font-semibold py-3 rounded-lg shadow hover:bg-green-600 transition-colors text-lg"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}