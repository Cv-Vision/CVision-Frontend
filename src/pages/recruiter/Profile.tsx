import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon, CheckIcon } from '@heroicons/react/24/outline';
import BackButton from '@/components/BackButton';

export function RecruiterProfile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  // Inicializar los campos con datos del usuario o sessionStorage
  useEffect(() => {
    // Obtener datos del contexto de autenticación
    const userEmail = user?.email || '';
    const userName = user?.name || '';
    const userCompany = user?.company || '';

    // Como fallback, intentar obtener el email del sessionStorage
    let sessionEmail = '';
    try {
      const sessionUser = sessionStorage.getItem('user');
      if (sessionUser) {
        const parsedUser = JSON.parse(sessionUser);
        sessionEmail = parsedUser.email || '';
      }
    } catch (error) {
      console.warn('Error parsing session user:', error);
    }

    // Usar el email del contexto o del sessionStorage
    const finalEmail = userEmail || sessionEmail;
    
    setName(userName);
    setEmail(finalEmail);
    setCompany(userCompany);

    // Debug: mostrar qué datos se están usando
    console.log('Profile data:', {
      contextUser: user,
      sessionEmail,
      finalEmail,
      userName,
      userCompany
    });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    console.log('Saving profile:', { name, email, company });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full p-10 flex flex-col items-center">
        <div className="w-full flex justify-start mb-6">
          <BackButton />
        </div>
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <UserIcon className="h-12 w-12 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center">
            Mi Perfil
          </h1>
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Reclutador
          </span>
        </div>

        <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-800">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Ingresa tu nombre completo"
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-800">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            {!email && (
              <p className="text-sm text-orange-600">
                ⚠️ No se pudo cargar el email automáticamente. Por favor, ingrésalo manualmente.
              </p>
            )}
          </div>

          {/* Empresa */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-800">
              Empresa / Organización
            </label>
            <input
              type="text"
              placeholder="Nombre de tu empresa"
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              value={company}
              onChange={e => setCompany(e.target.value)}
              required
            />
          </div>

          {/* Botón de guardar */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-2 hover:scale-105"
          >
            <CheckIcon className="h-5 w-5" />
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}