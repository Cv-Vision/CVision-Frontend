import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { createJobForm } from '@/hooks/createJobForm';

export default function CreateJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const {
    createJob,
    isSubmitting,
    error,
    success
  } = createJobForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createJob({ title, description });
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10">
      <div className="max-w-xl mx-auto bg-white p-8 rounded shadow">
        <BackButton />
        <h2 className="text-2xl font-semibold mb-6">Crear Nuevo Puesto</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Descripción del Puesto</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={4}
              required
            />
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}
          {success && <p className="text-green-600 mb-2">¡Puesto creado con éxito!</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate('/recruiter/dashboard')}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Puesto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
