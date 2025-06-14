import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon } from '@heroicons/react/24/solid';

// interface CVHistory {
//   id: string;
//   date: string;
//   status: 'pending' | 'analyzed' | 'error';
//   matches: number;
// }

export function CandidateProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // lógica para guardar perfil
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-xl w-full p-10 flex flex-col items-center">
        <UserIcon className="h-12 w-12 text-blue-400 mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">Mi Perfil</h1>
        <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Biografía, experiencia, etc."
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[100px]"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-400 text-white font-semibold py-3 rounded-lg shadow hover:bg-blue-600 transition-colors text-lg"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}