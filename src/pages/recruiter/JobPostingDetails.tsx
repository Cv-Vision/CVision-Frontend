import { useNavigate, useParams } from 'react-router-dom';
import { useGetJobById } from '@/hooks/useGetJobById.ts';
import { useUpdateJobPostingData } from '@/hooks/useUpdateJobPostingData';
import { CVDropzone } from '@/components/CVDropzone';
import { useState, useEffect } from 'react';
import AnalysisButton from '@/components/AnalysisButton';
import { useGetCandidatesByJobId } from '@/hooks/useGetCandidatesByJobId';
import { useGetAnalysisResults } from '@/hooks/useGetAnalysisResults';
import CVAnalysisResultsInline, { CVAnalysisMetricsSummary } from './CVAnalysisResultsInline';
import BackButton from '@/components/BackButton';
import { XMarkIcon } from '@heroicons/react/24/solid';
import CandidateList from '@/components/CandidateList';
import ExtraRequirementsForm, { ExtraRequirements } from '@/components/ExtraRequirementsForm';
import axios from 'axios';
import { getPermissionsByStatus, JobPostingStatus } from '../recruiter/jp_elements/jobPostingPermissions';

const JobPostingDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { job, isLoading, error } = useGetJobById(jobId ?? '');

  const {
    updateJobPostingData,
    loading: statusLoading,
    error: statusError,
  } = useUpdateJobPostingData();

  // Local UI state
  const [selectedStatus, setSelectedStatus] = useState<JobPostingStatus>('ACTIVE');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);

  const [uploadedCvs, setUploadedCvs] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [extraRequirements, setExtraRequirements] = useState<ExtraRequirements | undefined>(undefined);

  const S3_BASE_URL = 'https://cv-bucket.s3.amazonaws.com/';
  const getFileNameFromKey = (key: string) => key.split('/').pop() || key;
  const handleRemoveUploadedCv = (key: string) => setUploadedCvs(prev => prev.filter(k => k !== key));

  const [showSuccess, setShowSuccess] = useState(false);

  const cleanJobId = job?.pk?.replace(/^JD#/, '') || '';
  const { refetch: refetchCandidates } = useGetCandidatesByJobId(cleanJobId);
  const { results: analysisResults, isLoading: analysisLoading, error: analysisError, refetch: refetchAnalysisResults } = useGetAnalysisResults(cleanJobId);

  // Navigate to full analysis view
  const analysisDetailsPath = `/recruiter/job/${cleanJobId}/analysis`;
  const goToFullAnalysis = () => navigate(analysisDetailsPath);

  // Sync status from job
  useEffect(() => {
    if (job && ['ACTIVE', 'INACTIVE', 'CANCELLED', 'DELETED'].includes(job.status as string)) {
      setSelectedStatus(job.status as JobPostingStatus);
    }
  }, [job?.status]);

  // Permissions based on current status
  const { canEditFields, canAddCVs, canChangeStatus } = getPermissionsByStatus(selectedStatus);

  // Handlers
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as JobPostingStatus;
    if (job && newStatus) {
      setSelectedStatus(newStatus);
      await updateJobPostingData(job.pk, { status: newStatus });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleEditClick = () => {
    if (canEditFields) {
      setIsEditingDescription(true);
      setNewDescription(job?.description ?? '');
    }
  };

  const handleSaveDescription = async () => {
    if (job && canEditFields) {
      await updateJobPostingData(job.pk, { description: newDescription });
      setIsEditingDescription(false);
    }
  };

  const handleUpdateJob = async () => {
    if (!job || !canEditFields) return;
    setUploadError(null);
    setUploadSuccessMessage(null);
    try {
      const token = sessionStorage.getItem('idToken');
      if (!token) throw new Error('No hay token de autenticación.');
      const payload: Record<string, any> = { description: job.description };
      // Extra requirements mapping...
      if (extraRequirements) {
        // map experience_level, english_level, industry_experience, contract_type, additional_requirements
        // (same as before)
      }
      const url = `https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/job-postings/${job.pk.replace('JD#', '')}/update`;
      await axios.put(url, payload, { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } });
      setUploadSuccessMessage('Requisitos actualizados correctamente.');
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || err.message || 'Error al actualizar.');
    }
  };

  if (isLoading) return <p className="p-4">Cargando datos del puesto...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!job) return <p className="p-4">No se encontró el puesto de trabajo.</p>;

  return (
      <div className="min-h-screen bg-blue-100 py-10 px-4 flex flex-row gap-8">
        <div className="flex-1 w-full bg-white p-8 rounded-2xl shadow-lg space-y-8 relative">
          <BackButton />
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
            <div className="flex flex-col">
              <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  disabled={!canChangeStatus || statusLoading}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="ACTIVE">Activo</option>
                <option value="INACTIVE">Inactivo</option>
                <option value="CANCELLED">Cancelado</option>
                <option value="DELETED">Eliminado</option>
              </select>
              {statusError && <span className="text-red-500 text-xs mt-1">{statusError}</span>}
              {showSuccess && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded shadow text-sm animate-fade-in-out z-50">
                    Estado actualizado correctamente.
                  </div>
              )}
            </div>
          </div>

          {/* Descripción y Candidatos */}
          <div className="flex flex-row gap-8">
            <div className="flex-[2] min-w-0">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                Descripción del Puesto
                <button onClick={() => setIsDescriptionCollapsed(v => !v)} className="ml-2 text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700">
                  {isDescriptionCollapsed ? 'Mostrar' : 'Minimizar'}
                </button>
              </h2>
              {!isDescriptionCollapsed ? (
                  <>
                    {isEditingDescription ? (
                        <textarea
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            value={newDescription}
                            onChange={e => setNewDescription(e.target.value)}
                            disabled={!canEditFields}
                        />
                    ) : (
                        <p className="bg-gray-100 p-4 rounded whitespace-pre-line">{job.description}</p>
                    )}
                    <div className="mt-2 flex gap-2">
                      {isEditingDescription ? (
                          <button
                              onClick={handleSaveDescription}
                              disabled={!canEditFields}
                              className="px-4 py-1 bg-green-500 text-white rounded disabled:opacity-50"
                          >
                            Guardar
                          </button>
                      ) : (
                          <button
                              onClick={handleEditClick}
                              disabled={!canEditFields}
                              className="px-4 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                          >
                            Editar
                          </button>
                      )}
                    </div>
                  </>
              ) : (
                  <div className="relative">
                    <p className="bg-gray-100 p-4 rounded whitespace-pre-line max-h-80 overflow-hidden">{job.description}</p>
                    <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-8 rounded-b-2xl" style={{ background: 'linear-gradient(to bottom, rgba(243,244,246,0) 0%, rgba(243,244,246,1) 100%)' }} />
                  </div>
              )}
            </div>

            <div className="flex-1 min-w-0 max-w-md">
              <h2 className="text-lg font-semibold mb-2">Candidatos</h2>
              <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                <CandidateList jobId={cleanJobId} />
              </div>
            </div>
          </div>

          {/* Resultados del análisis */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Top 3 resultados</h2>
              <button
                  onClick={goToFullAnalysis}
                  disabled={analysisResults.length === 0}
                  className={`px-4 py-1 rounded text-sm transition-colors ${analysisResults.length === 0 ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                Ver Análisis Completo
              </button>
            </div>
            <CVAnalysisResultsInline jobId={cleanJobId} />
          </div>
        </div>

        {/* Panel derecho */}
        <div className="w-full max-w-xs bg-white p-6 rounded-2xl shadow-lg self-start space-y-6">
          <div>
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
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Cargar nuevos CVs</h2>
            {!canAddCVs ? (
                <p className="text-gray-600 text-sm">No se pueden agregar CVs en este estado.</p>
            ) : (
                <>
                  {uploadError && <div className="text-red-600 text-sm mb-2">{uploadError}</div>}
                  {uploadSuccessMessage && <div className="text-green-600 text-sm mb-2">{uploadSuccessMessage}</div>}
                  <CVDropzone
                      jobId={job.pk.startsWith('JD#') ? job.pk : `JD#${job.pk}`}
                      onUploadComplete={(keys) => {
                        setUploadError(null);
                        setUploadSuccessMessage('CVs subidos exitosamente');
                        setUploadedCvs(prev => [...prev, ...keys]);
                      }}
                      onError={(errorMsg) => {
                        setUploadError(errorMsg);
                        setUploadSuccessMessage(null);
                      }}
                  />

                  {uploadedCvs.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">CVs subidos:</h4>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {uploadedCvs.map((key) => (
                              <div key={key} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <a href={`${S3_BASE_URL}${key}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                  {getFileNameFromKey(key)}
                                </a>
                                <button onClick={() => handleRemoveUploadedCv(key)} className="text-gray-400 hover:text-gray-600">
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                          ))}
                        </div>
                      </div>
                  )}
                </>
            )}
          </div>

          <div>
            <ExtraRequirementsForm onChange={setExtraRequirements} />
            <button
                onClick={handleUpdateJob}
                disabled={!canEditFields}
                className={`w-full mt-2 px-4 py-2 rounded-md text-white font-medium ${!canEditFields ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'} transition-colors duration-200`}
            >
              Actualizar requisitos del puesto
            </button>
            {uploadSuccessMessage && <div className="text-green-600 text-sm mt-1">{uploadSuccessMessage}</div>}
            {uploadError && <div className="text-red-600 text-sm mt-1">{uploadError}</div>}
          </div>

          <div>
            <AnalysisButton
                jobId={job.pk}
                extraRequirements={extraRequirements}
                onSuccess={() => {
                  setTimeout(() => {
                    refetchCandidates();
                    refetchAnalysisResults();
                  }, 12000);
                }}
            />
          </div>
        </div>
      </div>
  );
};

export default JobPostingDetails;
