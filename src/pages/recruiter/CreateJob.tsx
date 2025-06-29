import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { useCreateJobForm } from '@/hooks/useCreateJobForm.ts';
import { BriefcaseIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function CreateJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const {
    createJob,
    isSubmitting,
    error,
    success
  } = useCreateJobForm();

  // Prevenir scroll en toda la página
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJob({ title, description });
  };

  // Navigate to job postings list when creation succeeds
  useEffect(() => {
    if (success) {
      navigate('/recruiter/job-postings');
    }
  }, [success, navigate]);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
        <BackButton />
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="relative">
            <BriefcaseIcon className="h-12 w-12 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Crear Nuevo Puesto
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Título */}
          <div className="space-y-3">
            <label className="block text-base font-semibold text-blue-800">
              Título del Puesto
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-blue-200 rounded-xl px-6 py-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              placeholder="Ej: Desarrollador Frontend Senior"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-3">
            <label className="block text-base font-semibold text-blue-800">
              Descripción del Puesto
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-blue-200 rounded-xl px-6 py-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
              rows={8}
              placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-600 text-base font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-600 text-base font-medium">¡Puesto creado exitosamente!</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-6 pt-6">
            <button
              type="button"
              onClick={() => navigate('/recruiter/dashboard')}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-gray-200 text-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publicando...
                </>
              ) : (
                <>
                  <PlusIcon className="h-6 w-6" />
                  Publicar Puesto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
