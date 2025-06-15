import { BriefcaseIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { fetchWithAuth } from '../../services/fetchWithAuth';

// Mock data para un puesto de trabajo
const mockJob = {
  id: 'c99db4c4-3894-4a00-bf46-473210d858ea',
  title: 'Desarrollador Frontend Senior',
  description: 'Buscamos un desarrollador Frontend Senior con experiencia en React, TypeScript y Tailwind CSS. El candidato ideal debe tener al menos 5 años de experiencia en desarrollo web y un fuerte conocimiento de patrones de diseño y arquitectura de software.',
  status: 'activo',
  company: 'TechCorp',
  createdAt: '2024-03-15'
};

const Candidates = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleViewAnalysis = async (jobId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = sessionStorage.getItem('idToken');
      if (!idToken) {
        throw new Error('No se encontró el token de identidad. Por favor, inicie sesión nuevamente.');
      }

      const response = await fetchWithAuth(
        `https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/get-cvs-analysis-results?job_id=${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Error al obtener los resultados del análisis');
      }

      const data = await response.json();
      // Navegar a la página de análisis con los datos
      navigate(`/recruiter/job/${jobId}/analysis`, { state: { analysisResults: data } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el análisis');
      console.error('Error fetching analysis results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <BriefcaseIcon className="h-8 w-8 text-green-400" />
            <h1 className="text-3xl font-bold text-gray-800">Puestos de trabajo</h1>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{mockJob.title}</div>
                    <div className="text-sm text-gray-500">{mockJob.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{mockJob.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {mockJob.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleViewAnalysis(mockJob.id)}
                        disabled={isLoading}
                      >
                        <EyeIcon className="h-5 w-5" />
                        {isLoading ? 'Cargando...' : 'Ver Análisis'}
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                        onClick={() => navigate(`/recruiter/edit-job/${mockJob.id}`)}
                      >
                        <PencilIcon className="h-5 w-5" />
                        Editar
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                        onClick={() => alert('Funcionalidad de eliminación en desarrollo')}
                      >
                        <TrashIcon className="h-5 w-5" />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidates; 