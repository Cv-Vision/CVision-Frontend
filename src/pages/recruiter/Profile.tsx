import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import BackButton from '@/components/other/BackButton.tsx';

export function RecruiterProfile() {
  const { user } = useAuth();
  const [, setIsEditing] = useState(false);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Prevenir scroll en toda la página
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  // Inicializar campos desde el contexto (username solo desde token/contexto)
  useEffect(() => {
    const userEmail = user?.email || '';
    const userFullName = (user as any)?.name || '';
    const userCompany = (user as any)?.company || '';
    const userUsername = (user as any)?.username || ''; // <- SOLO contexto

    // Podés mantener este fallback solo para email si querés
    let sessionEmail = '';
    try {
      const raw = sessionStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        sessionEmail = parsed?.email || '';
      }
    } catch {
      /* noop */
    }

    setFullName(userFullName);
    setEmail(userEmail || sessionEmail);
    setCompany(userCompany);
    setUsername(userUsername);

    // Toast si faltan nombre completo o empresa
    if (!userFullName || !userCompany) {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implementar actualización real (API)
    console.log('Saving profile:', { fullName, username, email, company });
    setIsEditing(false);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center py-10 px-2 overflow-hidden">
      {/* TOAST top-center */}
      {showToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50">
          <span>⚠️ Algunos datos no están completos. Te recomendamos completarlos.</span>
          <button onClick={() => setShowToast(false)} className="text-yellow-600 hover:text-yellow-800">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full p-10 flex flex-col items-center">
        <div className="w-full flex justify-start mb-6">
          <BackButton />
        </div>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <UserIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center">
            Mi Perfil
          </h1>
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Reclutador
          </span>
        </div>

        <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
          {/* 1. Nombre completo */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-800">Nombre completo</label>
            <input
              type="text"
              placeholder="Ingresa tu nombre completo"
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>

          {/* 2. Nombre de usuario (solo lectura, sin cursor prohibido) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-800">Nombre de usuario</label>
            <input
              type="text"
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg bg-gray-50 text-gray-700"
              value={username}
              readOnly
            />
          </div>

          {/* 3. Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-800">Correo electrónico</label>
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

          {/* 4. Empresa */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-blue-800">Empresa / Organización</label>
            <input
              type="text"
              placeholder="Nombre de tu empresa"
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              value={company}
              onChange={e => setCompany(e.target.value)}
              required
            />
          </div>

          {/* Guardar */}
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
