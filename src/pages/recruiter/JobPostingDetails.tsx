import { useNavigate, useParams } from 'react-router-dom';
import { useGetJobById } from '@/hooks/useGetJobById.ts';
import { useUpdateJobPostingData } from '@/hooks/useUpdateJobPostingData';
import { CVDropzone } from '@/components/other/CVDropzone.tsx';
import { useState, useEffect } from 'react';
import AnalysisButton from '@/components/other/AnalysisButton.tsx';
import { useGetApplicantsByJobId } from '@/hooks/useGetApplicantsByJobId.ts';
import { useGetAnalysisResults } from '@/hooks/useGetAnalysisResults';
import CVAnalysisResultsInline, { CVAnalysisMetricsSummary } from './CVAnalysisResultsInline';
import BackButton from '@/components/other/BackButton.tsx';
import { BriefcaseIcon, UsersIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import ApplicantList from '@/components/other/ApplicantList.tsx';
import JobRequirementsDisplay from '@/components/other/JobRequirementsDisplay.tsx';
import { getPermissionsByStatus, JobPostingStatus } from '../recruiter/jp_elements/jobPostingPermissions';
import type { Job } from '@/context/JobContext';
import ToastNotification from "@/components/other/ToastNotification.tsx";

// Helpers for displaying enum labels
function seniorityLabel(level?: string) {
  switch (level) {
    case 'JUNIOR': return 'Junior';
    case 'SEMISENIOR': return 'SemiSenior';
    case 'SENIOR': return 'Senior';
    default: return level || '';
  }
}
function contractTypeLabel(type?: string) {
  switch (type) {
    case 'FULL_TIME': return 'Full-Time';
    case 'PART_TIME': return 'Part-Time';
    case 'CONTRACT': return 'Contract';
    case 'FREELANCE': return 'Freelance';
    case 'INTERNSHIP': return 'Internship';
    default: return type || '';
  }
}

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

  // New editable fields state
  const [isEditingFields, setIsEditingFields] = useState(false);
  const [newSeniority, setNewSeniority] = useState<'JUNIOR' | 'SEMISENIOR' | 'SENIOR' | ''>('');
  const [newTipoContrato, setNewTipoContrato] = useState<'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP' | ''>('');
  const [newUbicacion, setNewUbicacion] = useState('');
  const [newEmpresa, setNewEmpresa] = useState('');
  const [fieldsSaveSuccess, setFieldsSaveSuccess] = useState(false);
  const [fieldsSaveError, setFieldsSaveError] = useState<string | null>(null);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);
  const [extraRequirements, setExtraRequirements] = useState<any | undefined>(undefined); // Changed type to any as per new_code
  const [showToast, setShowToast] = useState(false);
  const [localJob, setLocalJob] = useState<Job | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  

  const jobToShow = localJob || job;
  const cleanJobId = jobToShow?.pk ? jobToShow.pk.replace(/^JD#/, '') : '';
  const { refetch: refetchApplicants } = useGetApplicantsByJobId(cleanJobId);
  const { results: analysisResults, isLoading: analysisLoading, error: analysisError, refetch: refetchAnalysisResults } = useGetAnalysisResults(cleanJobId);

  // Navigate to full analysis view
  const analysisDetailsPath = `/recruiter/job/${cleanJobId}/analysis`;
  const goToFullAnalysis = () => navigate(analysisDetailsPath);

  // Sync status from job
  useEffect(() => {
    if (jobToShow && ['ACTIVE', 'INACTIVE', 'CANCELLED', 'DELETED'].includes(jobToShow.status as string)) {
      setSelectedStatus(jobToShow.status as JobPostingStatus);
    }
  }, [jobToShow?.status]);

  // Permissions based on current status
  const { canEditFields, canAddCVs, canChangeStatus } = getPermissionsByStatus(selectedStatus);

  // Handlers
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as JobPostingStatus;
    if (jobToShow && newStatus) {
      setSelectedStatus(newStatus);
      await updateJobPostingData(jobToShow.pk, { status: newStatus });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleEditClick = () => {
    if (canEditFields) {
      setIsEditingDescription(true);
      setNewDescription(jobToShow?.description ?? '');
      setIsDescriptionCollapsed(false);
    }
  };

  const handleSaveDescription = async () => {
    if (jobToShow && canEditFields) {
      setIsSavingDescription(true);
      setDescriptionSaveError(null);
      setDescriptionSaveSuccess(false);
      try {
        await updateJobPostingData(jobToShow.pk, { description: newDescription });
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

  const handleUpdateJob = async (updates?: any) => {
    if (!jobToShow) return;

    const payload: any = {};

    // Use the provided updates or fall back to extraRequirements
    const updatesToUse = updates || extraRequirements;
    
    if (updatesToUse && Object.keys(updatesToUse).length > 0) {
      Object.assign(payload, updatesToUse);
    }

    try {
      await updateJobPostingData(jobToShow.pk, payload);
      // Actualizar el estado local con los datos nuevos
      setLocalJob({ ...jobToShow, ...payload });
      setExtraRequirements(undefined); // Clear the requirements after successful update
      // Show success message for requirements update
      
    } catch (error) {
      console.error('Error updating job posting:', error);
    }
  };

  const handleRequirementsUpdate = (updates: any) => {
    setExtraRequirements(updates);
  };


  // Auto-dismiss success message
  useEffect(() => {
    if (uploadSuccessMessage) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setUploadSuccessMessage(null);
      }, 4000); // 4 seconds
      return () => clearTimeout(timer);
    }
  }, [uploadSuccessMessage]);
  
  // Handle toast notification
  useEffect(() => {
    if (!showToast) return;
    
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 2000); // 2 seconds as per requirements
    
    return () => clearTimeout(timer);
  }, [showToast]);

  // Auto-dismiss error message
  useEffect(() => {
    if (uploadError) {
      setShowToast(true);
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
  
  if (!jobToShow) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
      <div className="text-center text-blue-600 font-medium">No se encontró el puesto de trabajo.</div>
    </div>
  );


  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 flex flex-row gap-8 items-start">
        {/* Toast Notification for CV uploads */}
        {showToast && (uploadSuccessMessage || uploadError) && (
          <ToastNotification 
            message={uploadSuccessMessage || uploadError || ""}
            type={uploadSuccessMessage ? "success" : "error"}
            onClose={() => setShowToast(false)}
          />
        )}
        
        <div className="flex-1 w-full bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 space-y-4 relative">
          {/* Status Selector con estilos */}
          <div className="absolute top-8 right-8 z-10 flex flex-col items-end gap-2">
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              disabled={!canChangeStatus || statusLoading}
              className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-lg border-2 transition-all duration-300 cursor-pointer
      ${
                selectedStatus === 'ACTIVE'
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                  : selectedStatus === 'INACTIVE'
                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
                    : selectedStatus === 'CANCELLED'
                      ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <option value="ACTIVE" className="text-green-700 font-semibold">Activo</option>
              <option value="INACTIVE" className="text-yellow-700 font-semibold">Inactivo</option>
              <option value="CANCELLED" className="text-red-700 font-semibold">Cancelado</option>
              <option value="DELETED" className="text-gray-700 font-semibold">Eliminado</option>
            </select>

            {statusError && <span className="text-red-500 text-xs">{statusError}</span>}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-xl shadow-lg text-sm animate-fade-in-out">
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
              {jobToShow.title}
            </h1>
          </div>

          {/* Editable Job Fields */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-800">
              <BriefcaseIcon className="h-6 w-6" />
              Detalles del Puesto
              {!isEditingFields ? (
                <button
                  onClick={() => {
                    setIsEditingFields(true);
                    setNewSeniority((jobToShow.experience_level as 'JUNIOR' | 'SEMISENIOR' | 'SENIOR') || '');
                    setNewTipoContrato((jobToShow.contract_type as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP') || '');
                    setNewUbicacion(jobToShow.location || '');
                    setNewEmpresa(jobToShow.company || '');
                  }}
                  disabled={!canEditFields}
                  className="ml-2 px-4 py-1 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg disabled:opacity-50 transition-all duration-300 hover:scale-105 font-medium"
                >
                  Editar
                </button>
              ) : (
                <div className="ml-2 flex gap-2">
                  <button
                    onClick={async () => {
                      setFieldsSaveError(null);
                      try {
                        await updateJobPostingData(jobToShow.pk, {
                          experience_level: newSeniority || undefined,
                          contract_type: newTipoContrato || undefined,
                          location: newUbicacion || undefined,
                          company: newEmpresa || undefined, // Added company to the update payload
                        });
                        setLocalJob({
                          ...jobToShow,
                          experience_level: newSeniority,
                          contract_type: newTipoContrato,
                          location: newUbicacion,
                          company: newEmpresa, // Ensure local state reflects the updated company
                        });
                        setIsEditingFields(false);
                        setFieldsSaveSuccess(true);
                        setTimeout(() => setFieldsSaveSuccess(false), 3000);
                      } catch (err: any) {
                        setFieldsSaveError(err?.response?.data?.message || err.message || 'Error al actualizar los campos.');
                      }
                    }}
                    disabled={!canEditFields}
                    className="px-4 py-1 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg disabled:opacity-50 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingFields(false);
                      setFieldsSaveError(null);
                    }}
                    disabled={!canEditFields}
                    className="px-4 py-1 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg disabled:opacity-50 transition-all duration-300 hover:scale-105 font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </h2>
            {fieldsSaveSuccess && (
              <div className="mb-2 p-2 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm">Campos actualizados correctamente</div>
            )}
            {fieldsSaveError && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm">{fieldsSaveError}</div>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-2">
              <div>
                <label className="block text-blue-700 font-medium mb-1">Seniority</label>
                {isEditingFields ? (
                  <select
                    className="w-full border-2 border-blue-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50"
                    value={newSeniority}
                    onChange={e => setNewSeniority(e.target.value as 'JUNIOR' | 'SEMISENIOR' | 'SENIOR' | '')}
                  >
                    <option value="">Seleccionar</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="SEMISENIOR">SemiSenior</option>
                    <option value="SENIOR">Senior</option>
                  </select>
                ) : (
                  <div className="text-blue-900">{seniorityLabel(jobToShow.experience_level) || <span className="text-gray-400">No especificado</span>}</div>
                )}
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-1">Tipo de Contrato</label>
                {isEditingFields ? (
                  <select
                    className="w-full border-2 border-blue-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50"
                    value={newTipoContrato}
                    onChange={e => setNewTipoContrato(e.target.value as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP' | '')}
                  >
                    <option value="">Seleccionar</option>
                    <option value="FULL_TIME">Full-Time</option>
                    <option value="PART_TIME">Part-Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="INTERNSHIP">Internship</option>
                  </select>
                ) : (
                  <div className="text-blue-900">{contractTypeLabel(jobToShow.contract_type) || <span className="text-gray-400">No especificado</span>}</div>
                )}
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-1">Ubicación del Puesto</label>
                {isEditingFields ? (
                  <input
                    className="w-full border-2 border-blue-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50"
                    value={newUbicacion}
                    onChange={e => setNewUbicacion(e.target.value)}
                    placeholder="Ej: Remoto, Buenos Aires, etc."
                  />
                ) : (
                  <div className="text-blue-900">{jobToShow.location || <span className="text-gray-400">No especificado</span>}</div>
                )}
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-1">Empresa</label>
                {isEditingFields ? (
                  <input
                    className="w-full border-2 border-blue-200 rounded-xl px-3 py-2 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50"
                    value={newEmpresa}
                    onChange={e => setNewEmpresa(e.target.value)}
                    placeholder="Nombre de la empresa"
                  />
                ) : (
                  <div className="text-blue-900">{jobToShow.company || <span className="text-gray-400">No especificado</span>}</div>
                )}
              </div>
            </div>
          </div>

          {/* Descripción y Aplicantes */}
          <div className="flex flex-row gap-8">
            <div className="flex-[2] min-w-0 w-full overflow-hidden">
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
                        setNewDescription(jobToShow?.description ?? '');
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
                  <p className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 whitespace-pre-wrap break-all w-full max-w-full overflow-hidden">{jobToShow.description}</p>
              ) : (
                  <div className="relative">
                    <p className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 whitespace-pre-wrap break-all w-full max-w-full max-h-80 overflow-hidden">{jobToShow.description}</p>
                    <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-8 rounded-b-2xl" style={{ background: 'linear-gradient(to bottom, rgba(239,246,255,0) 0%, rgba(239,246,255,1) 100%)' }} />
                  </div>
              )}
            </div>

            <div className="flex-1 min-w-0 max-w-md">
              <h2 className="text-xl font-semibold mb-2 flex items-center gap-2 text-blue-800">
                <UsersIcon className="h-6 w-6" />
                Aplicantes
              </h2>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                <ApplicantList jobId={cleanJobId} onApplicantDeleted={() => { refetchApplicants(); refetchAnalysisResults(); }} />
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
            ) : analysisResults.length === 0 ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-full bg-blue-100">
                      <ChartBarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-800 font-semibold mb-1">No hay métricas disponibles</p>
                      <p className="text-blue-600 text-sm">Para ver métricas, realice un análisis</p>
                    </div>
                  </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
                  <CVAnalysisMetricsSummary results={analysisResults} />
                </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-800">Cargar CVs</h2>
            {!canAddCVs ? (
                <p className="text-blue-600 text-sm p-3 bg-blue-50 rounded-xl border border-blue-200">No se pueden agregar CVs en este estado.</p>
            ) : (
                <div className="space-y-4">


                  

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
                    <CVDropzone
                        jobId={jobToShow.pk.startsWith('JD#') ? jobToShow.pk : `JD#${jobToShow.pk}`}
                        onUploadComplete={() => {
                          setUploadError(null);
                          setUploadSuccessMessage('CVs subidos exitosamente');
                        }}
                        onError={(errorMsg) => {
                          setUploadError(errorMsg);
                          setUploadSuccessMessage(null);
                        }}
                    />
                  </div>
                </div>
            )}
          </div>

          <div>

             </div>

                      <div>
            <h2 className="text-lg font-semibold mb-4 text-blue-800">Requisitos del análisis</h2>
              <JobRequirementsDisplay 
                job={jobToShow} 
                onUpdate={handleRequirementsUpdate}
                canEdit={canEditFields}
              />
          </div>

           <div>
             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
               <AnalysisButton
                   jobId={jobToShow.pk}
                   extraRequirements={extraRequirements}
                   onSuccess={() => {
                     setTimeout(() => {
                       refetchApplicants();
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
