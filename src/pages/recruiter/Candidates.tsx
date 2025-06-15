import { BriefcaseIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { fetchWithAuth } from '../../services/fetchWithAuth';
import { CVDropzone } from '../../components/CVDropzone';

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
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(false);

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
      navigate(`/recruiter/job/${jobId}/analysis`, { state: { analysisResults: data } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el análisis');
      console.error('Error fetching analysis results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectJob = (jobId: string) => {
    setSelectedJob(jobId);
    setUploadError(null);
    setUploadSuccess(false);
    setShowUploadArea(false);
  };

  const handleStartUpload = () => {
    if (selectedJob) {
      setShowUploadArea(true);
    }
  };

  const handleUploadComplete = (fileUrls: string[]) => {
    console.log('CVs subidos exitosamente:', fileUrls);
    setUploadSuccess(true);
    setUploadError(null);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadSuccess(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-[1600px] mx-auto">
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

          <div className="flex gap-8">
            {/* Lista de puestos - Ancho fijo sin scroll */}
            <div className="w-[800px] flex-shrink-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`hover:bg-gray-50 ${selectedJob === mockJob.id ? 'bg-blue-50' : ''}`}>
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
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
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
                        <button
                          className={`px-3 py-1 rounded-md text-sm font-medium ${
                            selectedJob === mockJob.id
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                          onClick={() => handleSelectJob(mockJob.id)}
                        >
                          {selectedJob === mockJob.id ? 'Seleccionado' : 'Seleccionar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Sección de subida de CVs - Ocupa el espacio restante */}
            <div className="flex-1 bg-gray-50 rounded-lg p-6">
              {selectedJob ? (
                showUploadArea ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Subir CVs para: {mockJob.title}
                      </h3>
                      <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
                        onClick={() => setShowUploadArea(false)}
                      >
                        Cambiar puesto
                      </button>
                    </div>
                    <CVDropzone
                      jobId={selectedJob}
                      onUploadComplete={handleUploadComplete}
                      onError={handleUploadError}
                    />
                    {uploadError && (
                      <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                        {uploadError}
                      </div>
                    )}
                    {uploadSuccess && (
                      <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">
                        CVs subidos exitosamente
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Puesto seleccionado: {mockJob.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Haz clic en el botón de abajo para comenzar a subir CVs para este puesto
                    </p>
                    <button
                      className="px-6 py-3 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                      onClick={handleStartUpload}
                    >
                      Comenzar a subir CVs
                    </button>
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Selecciona un puesto de trabajo
                  </h3>
                  <p className="text-gray-600">
                    Para subir CVs, primero selecciona un puesto de trabajo de la lista
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Candidates; 