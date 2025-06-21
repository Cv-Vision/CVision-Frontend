import { useNavigate, useParams } from 'react-router-dom';
import { useGetJobById } from '@/hooks/useGetJobById.ts';
import CandidateList from '@/components/CandidateList';
import { CVDropzone } from "@/components/CVDropzone";
import { useState, useEffect } from 'react';
import AnalysisButton from '@/components/AnalysisButton';
import { useGetCandidatesByJobId } from '@/hooks/useGetCandidatesByJobId';
import CVAnalysisResultsInline, { CVAnalysisMetricsSummary } from './CVAnalysisResultsInline';
import { getGeminiAnalysisResults } from '@/services/geminiAnalysisService';
import type { GeminiAnalysisResult } from '@/services/geminiAnalysisService';
import BackButton from '@/components/BackButton';

interface GeminiAnalysisResultWithCreatedAt extends GeminiAnalysisResult {
  name?: string;
  created_at?: string;
}

const JobPostingDetails = () => {
  const { jobId } = useParams(); //la ruta será /recruiter/:jobId
  const navigate = useNavigate();
  const { job, isLoading, error } = useGetJobById(jobId ?? '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<GeminiAnalysisResultWithCreatedAt[]>([]);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Hook para obtener candidatos
  const cleanJobId = job?.pk?.replace(/^JD#/, '') || '';
  const { candidates, isLoading: candidatesLoading, error: candidatesError } = useGetCandidatesByJobId(cleanJobId);
  const analysisDetailsPath = `/recruiter/job/${cleanJobId}/analysis`;
  const andaPaAllaBobo = () => {
    navigate(analysisDetailsPath);
  };
  
  useEffect(() => {
    const fetchResults = async () => {
      if (!cleanJobId) return;
      try {
        setAnalysisLoading(true);
        setAnalysisError(null);
        const data = await getGeminiAnalysisResults(cleanJobId);
        setAnalysisResults([...data].sort((a, b) => b.score - a.score));
      } catch (err) {
        setAnalysisError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setAnalysisLoading(false);
      }
    };
    fetchResults();
  }, [cleanJobId]);

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
    <div className="min-h-screen bg-blue-100 py-10 px-4 flex flex-row gap-8">
      {/* Card pequeño para cargar nuevos CVs */}
      <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-lg self-start mt-16">
        {/* Métricas de análisis arriba */}
        <h2 className="text-lg font-semibold mb-4">Métricas de análisis</h2>
        {analysisLoading ? (
          <div className="flex justify-center items-center h-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : analysisError ? (
          <div className="text-red-600 text-sm mb-2">{analysisError}</div>
        ) : (
          <CVAnalysisMetricsSummary results={analysisResults} />
        )}
        <h2 className="text-lg font-semibold mb-2 mt-8">Cargar nuevos CVs</h2>
        <CVDropzone jobId={job.pk.startsWith('JD#') ? job.pk : `JD#${job.pk}`} />
        <div className="mt-4">
          <AnalysisButton jobId={job.pk} />
        </div>
      </div>
      {/* Card principal */}
      <div className="flex-1 w-full bg-white p-8 rounded-2xl shadow-lg space-y-8 relative">
        <BackButton />
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
              <div className="relative">
                <p className="bg-gray-100 p-4 rounded whitespace-pre-line max-h-80 overflow-hidden">
                  {job.description}
                </p>
                {/* Gradiente para indicar que hay más texto */}
                <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-8 rounded-b-2xl"
                  style={{background: 'linear-gradient(to bottom, rgba(243,244,246,0) 0%, rgba(243,244,246,1) 100%)'}}
                />
              </div>
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
        {/* Resultados del análisis debajo de la descripción y extendido */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Resultados del análisis</h2>
            <button
              onClick={andaPaAllaBobo}
              className="px-4 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Ver Análisis Completo
            </button>
          </div>
          <div className="w-full">
            <CVAnalysisResultsInline jobId={cleanJobId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetails;
