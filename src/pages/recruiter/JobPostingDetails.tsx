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
import { BriefcaseIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';
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
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const [descriptionSaveSuccess, setDescriptionSaveSuccess] = useState(false);
  const [descriptionSaveError, setDescriptionSaveError] = useState<string | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [extraRequirements, setExtraRequirements] = useState<ExtraRequirements | undefined>(undefined);
  const [showUploadNotification, setShowUploadNotification] = useState(false);
  const [recentlyUploadedCvs, setRecentlyUploadedCvs] = useState<string[]>([]);

  const getFileNameFromKey = (key: string) => key.split('/').pop() || key;

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
      setIsDescriptionCollapsed(false);
    }
  };

  const handleSaveDescription = async () => {
    if (job && canEditFields) {
      setIsSavingDescription(true);
      setDescriptionSaveError(null);
      setDescriptionSaveSuccess(false);
      try {
        await updateJobPostingData(job.pk, { description: newDescription });
        setIsEditingDescription(false);
        setDescriptionSaveSuccess(true);
        setTimeout(() => setDescriptionSaveSuccess(false), 3000);
      } catch (err: any) {
        setDescriptionSaveError(err?.response?.data?.message || err.message || 'Error al actualizar la descripción.');
      } finally {
        setIsSavingDescription(false);
      }
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

  // Auto-dismiss upload notifications
  useEffect(() => {
    if (showUploadNotification) {
      const timer = setTimeout(() => {
        setShowUploadNotification(false);
        setRecentlyUploadedCvs([]);
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showUploadNotification]);

  // Auto-dismiss success message
  useEffect(() => {
    if (uploadSuccessMessage) {
      const timer = setTimeout(() => {
        setUploadSuccessMessage(null);
      }, 4000); // 4 seconds
      return () => clearTimeout(timer);
    }
  }, [uploadSuccessMessage]);

  // Auto-dismiss error message
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => {
        setUploadError(null);
      }, 6000); // 6 seconds for errors
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  // Auto-adjust textarea height when editing starts
  useEffect(() => {
    if (isEditingDescription) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';
      }
    }
  }, [isEditingDescription, newDescription]);

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-blue-600">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium">Cargando datos del puesto...</span>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
      <div className="text-center text-red-600 font-medium">{error}</div>
    </div>
  );
  
  if (!job) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
      <div className="text-center text-blue-600 font-medium">No se encontró el puesto de trabajo.</div>
    </div>
  );

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 flex flex-row gap-8 items-start">
        <div className="flex-1 w-full bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 space-y-4 relative">
          {/* Status Selector - ABSOLUTE */}
          <div className="absolute top-8 right-8 z-10">
            <select
                value={selectedStatus}
                onChange={handleStatusChange}
                disabled={!canChangeStatus || statusLoading}
                className="border-2 border-blue-200 rounded-xl px-4 py-2 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="DELETED">Eliminado</option>
            </select>
            {statusError && <span className="text-red-500 text-xs mt-1">{statusError}</span>}
            {showSuccess && (
                <div className="absolute top-12 right-0 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-xl shadow-lg text-sm animate-fade-in-out z-50">
                  Estado actualizado correctamente.
                </div>
            )}
          </div>

          <BackButton />
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <BriefcaseIcon className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              {job.title}
            </h1>
          </div>

          {/* Descripción y Candidatos */}
          <div className="flex flex-row gap-8">
            <div className="flex-[2] min-w-0">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-800">
                <BriefcaseIcon className="h-6 w-6" />
                Descripción del Puesto
                <button 
                  onClick={() => setIsDescriptionCollapsed(v => !v)} 
                  disabled={isEditingDescription}
                  className={`ml-2 text-xs px-3 py-1 rounded-full transition-all duration-300 ${
                    isEditingDescription 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                  }`}
                >
                  {isDescriptionCollapsed ? 'Mostrar' : 'Minimizar'}
                </button>
                {!isEditingDescription ? (
                  <button
                    onClick={handleEditClick}
                    disabled={!canEditFields}
                    className="ml-2 px-4 py-1 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg disabled:opacity-50 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    Editar
                  </button>
                ) : (
                  <div className="ml-2 flex gap-2">
                    <button
                      onClick={handleSaveDescription}
                      disabled={!canEditFields || isSavingDescription}
                      className="px-4 py-1 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg disabled:opacity-50 transition-all duration-300 hover:scale-105 font-medium flex items-center gap-2"
                    >
                      {isSavingDescription ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Guardando...
                        </>
                      ) : (
                        'Guardar'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingDescription(false);
                        setNewDescription(job?.description ?? '');
                        setDescriptionSaveError(null);
                      }}
                      disabled={!canEditFields || isSavingDescription}
                      className="px-4 py-1 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg disabled:opacity-50 transition-all duration-300 hover:scale-105 font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </h2>
              
              {/* Success/Error feedback for description editing */}
              {descriptionSaveSuccess && (
                <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-1 rounded-full bg-green-100 flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-green-800 font-medium text-sm">Descripción actualizada correctamente</p>
                  </div>
                </div>
              )}
              
              {descriptionSaveError && (
                <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-1 rounded-full bg-red-100 flex-shrink-0">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-red-800 font-medium text-sm">{descriptionSaveError}</p>
                    <button 
                      onClick={() => setDescriptionSaveError(null)}
                      className="text-red-400 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {isEditingDescription ? (
                <textarea
                    className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none min-h-[200px]"
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    disabled={!canEditFields}
                    rows={Math.max(6, newDescription.split('\n').length + 2)}
                    style={{ 
                      minHeight: '200px',
                      height: 'auto',
                      overflowY: 'auto'
                    }}
                />
              ) : !isDescriptionCollapsed ? (
                  <p className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 whitespace-pre-line">{job.description}</p>
              ) : (
                  <div className="relative">
                    <p className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 whitespace-pre-line max-h-80 overflow-hidden">{job.description}</p>
                    <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-8 rounded-b-2xl" style={{ background: 'linear-gradient(to bottom, rgba(239,246,255,0) 0%, rgba(239,246,255,1) 100%)' }} />
                  </div>
              )}
            </div>

            <div className="flex-1 min-w-0 max-w-md">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-800">
                <UsersIcon className="h-6 w-6" />
                Candidatos
              </h2>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                <CandidateList jobId={cleanJobId} />
              </div>
            </div>
          </div>

          {/* Resultados del análisis */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-800">
                <ChartBarIcon className="h-6 w-6" />
                Top 3 resultados
              </h2>
              <button
                  onClick={goToFullAnalysis}
                  disabled={analysisResults.length === 0}
                  className={`px-6 py-2 rounded-xl text-sm transition-all duration-300 font-semibold ${
                    analysisResults.length === 0 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
              >
                Ver Análisis Completo
              </button>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              <CVAnalysisResultsInline jobId={cleanJobId} />
            </div>
          </div>
        </div>

        {/* Panel derecho */}
        <div className="w-full max-w-xs bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-2xl border border-white/20 self-start space-y-6 min-h-fit">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-800">Métricas de análisis</h2>
            {analysisLoading ? (
                <div className="flex justify-center items-center h-16">
                  <div className="inline-flex items-center gap-3 text-blue-600">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Cargando...</span>
                  </div>
                </div>
            ) : analysisError ? (
                <div className="text-red-600 text-sm mb-2 p-3 bg-red-50 rounded-xl border border-red-200">{analysisError}</div>
            ) : (
                <CVAnalysisMetricsSummary results={analysisResults} />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-800">Cargar nuevos CVs</h2>
            {!canAddCVs ? (
                <p className="text-blue-600 text-sm p-3 bg-blue-50 rounded-xl border border-blue-200">No se pueden agregar CVs en este estado.</p>
            ) : (
                <div className="space-y-4">
                  {/* Notificación de éxito mejorada */}
                  {uploadSuccessMessage && (
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-green-100 flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-green-800 font-semibold">{uploadSuccessMessage}</p>
                          <p className="text-green-600 text-sm">Los archivos se han subido correctamente.</p>
                        </div>
                        <button 
                          onClick={() => setUploadSuccessMessage(null)}
                          className="text-green-400 hover:text-green-600 transition-colors duration-200 flex-shrink-0"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notificación de error mejorada */}
                  {uploadError && (
                    <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-red-100 flex-shrink-0">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-red-800 font-semibold">Error al subir archivos</p>
                          <p className="text-red-600 text-sm break-words">{uploadError}</p>
                        </div>
                        <button 
                          onClick={() => setUploadError(null)}
                          className="text-red-400 hover:text-red-600 transition-colors duration-200 flex-shrink-0"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Notificación de CVs recién subidos */}
                  {showUploadNotification && recentlyUploadedCvs.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm animate-fade-in-out">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-blue-800 font-semibold mb-3">
                            {recentlyUploadedCvs.length} CV{recentlyUploadedCvs.length > 1 ? 's' : ''} subido{recentlyUploadedCvs.length > 1 ? 's' : ''} recientemente:
                          </p>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {recentlyUploadedCvs.map((key, index) => (
                              <div key={key} className="flex items-center justify-between bg-white/70 rounded-lg p-3 border border-blue-100">
                                <span className="text-blue-700 text-sm font-medium truncate flex-1 mr-2">
                                  {getFileNameFromKey(key)}
                                </span>
                                <span className="text-blue-500 text-xs bg-blue-100 px-2 py-1 rounded-full flex-shrink-0">
                                  #{index + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowUploadNotification(false)}
                          className="text-blue-400 hover:text-blue-600 transition-colors duration-200 flex-shrink-0"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
                    <CVDropzone
                        jobId={job.pk.startsWith('JD#') ? job.pk : `JD#${job.pk}`}
                        onUploadComplete={(keys) => {
                          setUploadError(null);
                          setUploadSuccessMessage('CVs subidos exitosamente');
                          setRecentlyUploadedCvs(keys);
                          setShowUploadNotification(true);
                        }}
                        onError={(errorMsg) => {
                          setUploadError(errorMsg);
                          setUploadSuccessMessage(null);
                          setShowUploadNotification(false);
                        }}
                    />
                  </div>
                </div>
            )}
          </div>

          <div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
              <ExtraRequirementsForm onChange={setExtraRequirements} />
            </div>
            <button
                onClick={handleUpdateJob}
                disabled={!canEditFields}
                className={`w-full mt-4 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                  !canEditFields 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
            >
              Actualizar requisitos del puesto
            </button>
          </div>

          <div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
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
      </div>
  );
};

export default JobPostingDetails;
