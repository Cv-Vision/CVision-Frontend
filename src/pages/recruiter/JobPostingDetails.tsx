import { useParams } from 'react-router-dom';
import { useGetJobById } from '@/hooks/useGetJobById.ts';
import CandidateList from '@/components/CandidateList';
import { CVDropzone } from "@/components/CVDropzone";
import { useState } from 'react';
import AnalysisButton from '@/components/AnalysisButton';
import { useGetCandidatesByJobId } from '@/hooks/useGetCandidatesByJobId';
import CVAnalysisResultsInline from './CVAnalysisResultsInline';

const JobPostingDetails = () => {
  const { jobId } = useParams(); //la ruta será /recruiter/:jobId
  const { job, isLoading, error } = useGetJobById(jobId ?? '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);

  // Hook para obtener candidatos
  const cleanJobId = job?.pk?.replace(/^JD#/, '') || '';
  const { candidates, isLoading: candidatesLoading, error: candidatesError } = useGetCandidatesByJobId(cleanJobId);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    // #TODO: lógica para guardar status en la DB
    console.log('Cambiar status a:', newStatus);
  };

  const handleEditClick = () => {
    setIsEditingDescription(true);
    setNewDescription(job?.description ?? '');
  };

  const handleSaveClick = () => {
    // #TODO: lógica para guardar nueva descripción en la DB
    setIsEditingDescription(false);
    console.log('Guardar nueva descripción:', newDescription);
  };

  if (isLoading) return <p className="p-4">Cargando datos del puesto...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!job) return <p className="p-4">No se encontró el puesto de trabajo.</p>;

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
          <select
            defaultValue={job.status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
            <option value="-1">Cancelado</option>
          </select>
        </div>

        {/* Layout horizontal: Descripción y Candidatos */}
        <div className="flex flex-row gap-8">
          {/* Descripción del Puesto */}
          <div className="flex-[2] min-w-0">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              Descripción del Puesto
              <button
                className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => setIsDescriptionCollapsed((v) => !v)}
              >
                {isDescriptionCollapsed ? 'Mostrar' : 'Minimizar'}
              </button>
            </h2>
            {!isDescriptionCollapsed && (
              <>
                {isEditingDescription ? (
                  <textarea
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                ) : (
                  <p className="bg-gray-100 p-4 rounded whitespace-pre-line">{job.description}</p>
                )}
                <div className="mt-2 flex gap-2">
                  {isEditingDescription ? (
                    <button
                      onClick={handleSaveClick}
                      className="px-4 py-1 bg-green-500 text-white rounded"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={handleEditClick}
                      className="px-4 py-1 bg-blue-500 text-white rounded"
                    >
                      Editar
                    </button>
                  )}
                </div>
              </>
            )}
            {isDescriptionCollapsed && (
              <p className="bg-gray-100 p-4 rounded whitespace-pre-line">
                {job.description.split(/\s+/).slice(0, 100).join(' ')}{job.description.split(/\s+/).length > 100 ? '...' : ''}
              </p>
            )}
          </div>
          {/* Lista de Candidatos con scroll y alto máximo */}
          <div className="flex-1 min-w-0 max-w-md">
            <h2 className="text-lg font-semibold mb-2">Candidatos</h2>
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <CandidateList jobId={job.pk} candidates={candidates} isLoading={candidatesLoading} error={candidatesError} />
            </div>
          </div>
        </div>
        {/* Sección para cargar nuevos CVs */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Cargar nuevos CVs</h2>
          <CVDropzone jobId={job.pk.startsWith('JD#') ? job.pk : `JD#${job.pk}`} />
          <div className="mt-4">
            <AnalysisButton jobId={job.pk} />
          </div>
        </div>
        {/* Resultados del análisis debajo de la descripción y extendido */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Resultados del análisis</h2>
          <div className="w-full">
            <CVAnalysisResultsInline jobId={cleanJobId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetails;
