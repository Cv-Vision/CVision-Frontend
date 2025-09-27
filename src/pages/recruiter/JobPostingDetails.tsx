import { useNavigate, useParams } from 'react-router-dom';
import { useGetJobById } from '@/hooks/useGetJobById.ts';
import { useUpdateJobPostingData } from '@/hooks/useUpdateJobPostingData';
import { useState, useEffect, useRef } from 'react';
import { useGetApplicantsByJobId, useGetTop3ApplicantsByJobId } from '@/hooks/useGetApplicantsByJobId.ts';
import { useGetJobMetrics } from '@/hooks/useGetJobMetrics.ts';
import { useGetAnalysisResults } from '@/hooks/useGetAnalysisResults';
import { JobDetailsCard } from '@/components/rebranding/JobPostingDetails/JobDetailsCard';
import { JobPostingStats } from '@/components/rebranding/JobPostingDetails/JobPostingStats';
import { CandidateList } from '@/components/rebranding/JobPostingDetails/CandidateList';
import { CVDropzone } from '@/components/other/CVDropzone';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { CONFIG } from '@/config';

import { getPermissionsByStatus, JobPostingStatus } from '../recruiter/jp_elements/jobPostingPermissions';
import type { Job } from '@/context/JobContext';
import { useToast } from '@/context/ToastContext';

// ==== Helpers (igual que en tu versión) ====
function seniorityLabel(level?: string) {
  switch (level) {
    case 'JUNIOR': return 'Junior';
    case 'SEMISENIOR': return 'SemiSenior';
    case 'SENIOR': return 'Senior';
    default: return level || '';
  }
}
function modalLabel(level?: string) {
  switch (level) {
    case 'REMOTE': return 'Remoto';
    case 'ONSITE': return 'Presencial';
    case 'HYBRID': return 'Hibrido';
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
function englishLevelLabel(level?: string) {
  switch (level) {
    case 'BASIC': return 'Básico';
    case 'INTERMEDIATE': return 'Intermedio';
    case 'ADVANCED': return 'Avanzado';
    case 'NATIVE': return 'Nativo';
    case 'NOT_REQUIRED': return 'No requerido';
    default: return level || '';
  }
}

const JobPostingDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { job, isLoading, error } = useGetJobById(jobId ?? '');

  const { updateJobPostingData, loading: statusLoading, error: statusError } = useUpdateJobPostingData();

  // ===== Estado y permisos (mantenemos todo lo que ya tenías) =====
  const [selectedStatus, setSelectedStatus] = useState<JobPostingStatus>('ACTIVE');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');
  const [isDescriptionCollapsed, setIsDescriptionCollapsed] = useState(true);
  const [isSavingDescription, setIsSavingDescription] = useState(false);

  const [isEditingFields, setIsEditingFields] = useState(false);
  const [newSeniority, setNewSeniority] = useState<'JUNIOR' | 'SEMISENIOR' | 'SENIOR' | ''>('');
  const [newTipoContrato, setNewTipoContrato] = useState<'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP' | ''>('');
  const [newUbicacion, setNewUbicacion] = useState('');
  const [newEmpresa, setNewEmpresa] = useState('');
  const [newEnglishLevel, setNewEnglishLevel] = useState<'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE' | 'NOT_REQUIRED' | ''>('');
  const [newModal, setNewModal] = useState<'REMOTE' | 'ONSITE' | 'HYBRID' | ''>('');

  const [extraRequirements, setExtraRequirements] = useState<any | undefined>(undefined);
  const [localJob, setLocalJob] = useState<Job | null>(null);

  // ====== Portamos el flujo de polling de la página vieja ======
  const [isAnalysisPending, setIsAnalysisPending] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  const jobToShow = localJob || job;
  const cleanJobId = jobToShow?.pk ? jobToShow.pk.replace(/^JD#/, '') : '';

  // Hooks de datos (igual que antes)
  const { applicants, refetch: refetchApplicants } = useGetApplicantsByJobId(cleanJobId);
  const { top3Applicants, refetch: refetchTop3Applicants } = useGetTop3ApplicantsByJobId(cleanJobId);
  const { results: analysisResults, refetch: refetchAnalysisResults } = useGetAnalysisResults(cleanJobId);
  const { metrics, isLoading: metricsLoading, error: metricsError, refetchMetrics } = useGetJobMetrics(cleanJobId);

  const analysisDetailsPath = `/recruiter/job/${cleanJobId}/analysis`;
  const goToFullAnalysis = () => navigate(analysisDetailsPath);

  useEffect(() => {
    if (jobToShow && ['ACTIVE', 'INACTIVE', 'CANCELLED', 'DELETED'].includes(jobToShow.status as string)) {
      setSelectedStatus(jobToShow.status as JobPostingStatus);
    }
  }, [jobToShow?.status]);

  // === “Clear pending” como en la vieja ===
  useEffect(() => {
    if (isAnalysisPending) {
      const hasAnalysisResults = analysisResults && analysisResults.length > 0;
      const hasMetrics = metrics && metrics.total_analyzed > 0;
      if (hasAnalysisResults || hasMetrics) {
        setIsAnalysisPending(false);
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    }
  }, [analysisResults, metrics, isAnalysisPending]);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // ===== Permisos (como antes) =====
  const { canEditFields, canAddCVs, canChangeStatus } = getPermissionsByStatus(selectedStatus);

  // ===== Handlers que ya tenías (no toco estilos de la UI nueva) =====
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as JobPostingStatus;
    if (jobToShow && newStatus) {
      setSelectedStatus(newStatus);
      await updateJobPostingData(jobToShow.pk, { status: newStatus });
      showToast('Estado actualizado correctamente', 'success');
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
      try {
        await updateJobPostingData(jobToShow.pk, { description: newDescription });
        setIsEditingDescription(false);
        showToast('Descripción actualizada correctamente', 'success');
      } catch (err: any) {
        const msg = err?.response?.data?.message || err.message || 'Error al actualizar la descripción.';
        showToast(msg, 'error');
      } finally {
        setIsSavingDescription(false);
      }
    }
  };
  
  const handleRequirementsUpdate = (updates: any) => setExtraRequirements(updates);
  
  useEffect(() => {
    if (isEditingDescription) {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(200, textarea.scrollHeight) + 'px';
      }
    }
  }, [isEditingDescription, newDescription]);

  // 1) Estado para mostrar/ocultar el dropzone de CVs
  const [showDropzone, setShowDropzone] = useState(false);
  
  // Estados para el análisis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisSuccess, setShowAnalysisSuccess] = useState(false);

  // 2) Subida real de archivos (equivalente a CVDropzone de la vieja)
  async function uploadCandidatesFiles(jobPk: string, files: File[]) {
    // Si tu backend exige el prefijo, lo conservamos:
    const finalJobPk = jobPk.startsWith('JD#') ? jobPk : `JD#${jobPk}`;
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    formData.append('job_id', finalJobPk);

    // Ajustá la URL a tu endpoint real de subida
    const res = await fetch(`/api/jobs/${finalJobPk}/upload-candidates`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(msg || 'Error al subir CVs');
    }
  }

  // 3) Polling “igual que antes” tras subir archivos o lanzar análisis
  function startPollingForAnalysis() {
    setIsAnalysisPending(true);

    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(() => {
      refetchApplicants();
      refetchTop3Applicants();
      refetchMetrics();
      refetchAnalysisResults();
    }, 3000);

    // corte a los 5 minutos
    setTimeout(() => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      setIsAnalysisPending(false);
    }, 300000);
  }

  // 4) Handler del dropzone: sube y dispara polling
  const handleUploadComplete = async (fileUrls: string[]) => {
    try {
      showToast(`CVs subidos exitosamente (${fileUrls.length})`, 'success');

      // Refrescos iniciales
      await Promise.all([
        refetchApplicants(),
        refetchTop3Applicants(),
        refetchMetrics(),
        refetchAnalysisResults(),
      ]);

      // Polling como en la versión vieja
      startPollingForAnalysis();
      
      // Ocultar dropzone después de subir
      setShowDropzone(false);
    } catch (err: any) {
      showToast(err.message || 'Error al subir CVs', 'error');
    }
  };

  const handleUploadError = (error: string) => {
    showToast(error, 'error');
  };

  // 5) Handler para análisis de CVs
  const handleAnalyze = async () => {
    if (!jobToShow?.pk) return;
    
    try {
      setIsAnalyzing(true);
      setShowAnalysisSuccess(false);
      const token = sessionStorage.getItem('idToken');
      
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
      }

      const payload: Record<string, any> = { job_id: jobToShow.pk };
      // Ya no se envían requisitos adicionales
      const response = await axios.post(
        `${CONFIG.apiUrl}/recruiter/call-cv-batch-invoker`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.status === 200) {
        setShowAnalysisSuccess(true);
        showToast('Análisis iniciado correctamente', 'success');
        // Iniciar polling para obtener resultados
        startPollingForAnalysis();
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => setShowAnalysisSuccess(false), 5000);
      } else {
        throw new Error('Error al iniciar el análisis');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      showToast(errorMessage, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ======= Loading / error states (igual que en tu nueva) =======
  if (isLoading) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-blue-600">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-medium">Cargando datos del puesto...</span>
        </div>
      </div>
    </div>
  );
  }
  if (error) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center text-red-600 font-medium">{String(error)}</div>
    </div>
  );
  }
  if (!jobToShow) {
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
      <div className="text-center text-blue-600 font-medium">No se encontró el puesto de trabajo.</div>
    </div>
  );
  }

  // ======= UI NUEVA (NO cambio estética) =======
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col lg:flex-row gap-8 items-start relative">
      {/* Botón de navegación hacia atrás */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-teal-200 hover:border-teal-300 shadow-sm hover:shadow-md z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Volver</span>
      </button>

      {/* Columna izquierda: detalles (solo lectura en esta UI) */}
      <div className="w-full max-w-sm flex-shrink-0 mt-36">
        <JobDetailsCard
          positionName={jobToShow.title || 'No especificado'}
          location={jobToShow.location || 'No especificado'}
          modality={modalLabel(jobToShow.modal) || 'No especificado'}
          contractType={contractTypeLabel(jobToShow.contract_type) || 'No especificado'}
          level={seniorityLabel(jobToShow.experience_level) || 'No especificado'}
          salaryRange={'Salario a convenir'}
          publishedAt={'Fecha no disponible'}
          description={jobToShow.description || ''}
        />
          </div>

      {/* Columna derecha: métricas + lista de candidatos */}
      <div className="flex-1 flex flex-col gap-6">
        <JobPostingStats
          totalAnalyzed={metrics?.total_analyzed || 0}
          avgScore={
            typeof metrics?.average_score === 'number'
              ? Number(metrics?.average_score.toFixed(1))
              : Number(metrics?.average_score || 0)
          }
          highestScore={{
            value:
              typeof metrics?.highest_score === 'number'
                ? Number(metrics?.highest_score.toFixed(1))
                : Number(metrics?.highest_score || 0),
            name: metrics?.highest_score_applicant_name || 'N/A',
          }}
          lowestScore={{
            value:
              typeof metrics?.lowest_score === 'number'
                ? Number(metrics?.lowest_score.toFixed(1))
                : Number(metrics?.lowest_score || 0),
            name: metrics?.lowest_score_applicant_name || 'N/A',
          }}
        />

        <CandidateList
          candidates={(applicants || []).map((a: any, idx: number) => ({
            id: String(a.id || a.applicant_id || idx),
            name: a.name || a.full_name || a.applicant_name || 'Sin nombre',
            email: a.email || a.applicant_email || 'sin-email@dominio.com',
            experience: a.experience || a.experience_level || 'N/A',
            score: Number(a.score || a.match_score || 0),
            status: (a.status as 'Revisado' | 'Bueno' | 'Malo' | 'Sin revisar') || 'Sin revisar',
          }))}
          isLoading={false}
          error={null}
          refetch={refetchApplicants}
          onAddCandidate={() => setShowDropzone(true)} // ⟵ muestra dropzone
          onAnalyze={handleAnalyze} // ⟵ analiza CVs
          canAnalyze={!isAnalyzing} // ⟵ deshabilitado mientras analiza
          isAnalyzing={isAnalyzing} // ⟵ estado de carga
        />
            </div>

      {/* Dropzone para subir CVs */}
      {showDropzone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Agregar Nuevos Candidatos</h2>
              <button
                onClick={() => setShowDropzone(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
                    <CVDropzone
              jobId={jobToShow?.pk || ''}
              onUploadComplete={handleUploadComplete}
              onError={handleUploadError}
                    />
                  </div>
                </div>
            )}
       </div>
  );
};

export default JobPostingDetails;
