import { useNavigate, useParams } from 'react-router-dom';
import { useGetJobById } from '@/hooks/useGetJobById.ts';
import { useState, useEffect, useRef } from 'react';
import { useGetApplicantsByJobId } from '@/hooks/useGetApplicantsByJobId.ts';
import { useGetJobMetrics } from '@/hooks/useGetJobMetrics.ts';
import { useGetAnalysisResults } from '@/hooks/useGetAnalysisResults';
import { JobDetailsCard } from '@/components/rebranding/JobPostingDetails/JobDetailsCard';
import { JobPostingStats } from '@/components/rebranding/JobPostingDetails/JobPostingStats';
import { CandidateList } from '@/components/rebranding/JobPostingDetails/CandidateList';
import { CVDropzone } from '@/components/other/CVDropzone';
import { ArrowLeft } from 'lucide-react';
import axiosInstance from '@/services/axiosConfig';
import { CONFIG } from '@/config';

import { JobPostingStatus } from '../recruiter/jp_elements/jobPostingPermissions';
import type { Job } from '@/context/JobContext';
import { useToast } from '@/context/ToastContext';
import { useDeleteApplication } from '@/hooks/useDeleteApplication';

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

const JobPostingDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { job, isLoading, error } = useGetJobById(jobId ?? '');


  // ===== Estado y permisos (mantenemos todo lo que ya tenías) =====
  const [, setSelectedStatus] = useState<JobPostingStatus>('ACTIVE');
  const [localJob] = useState<Job | null>(null);

  // ====== Portamos el flujo de polling de la página vieja ======
  const [isAnalysisPending, setIsAnalysisPending] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();
  const { deleteApplication } = useDeleteApplication();
  const [deletingCandidates, setDeletingCandidates] = useState<Set<string>>(new Set());

  const jobToShow = localJob || job;
  const cleanJobId = jobToShow?.pk ? jobToShow.pk.replace(/^JD#/, '') : '';

  // Hooks de datos (igual que antes)
  const { applicants, refetch: refetchApplicants } = useGetApplicantsByJobId(cleanJobId);
  const { results: analysisResults, refetch: refetchAnalysisResults } = useGetAnalysisResults(cleanJobId);
  const { metrics } = useGetJobMetrics(cleanJobId);


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

  // ===== Handlers que ya tenías (no toco estilos de la UI nueva) =====

  

  // 1) Estado para mostrar/ocultar el dropzone de CVs
  const [showDropzone, setShowDropzone] = useState(false);
  
  // Estados para el análisis
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  // 3) Polling “igual que antes” tras subir archivos o lanzar análisis
  function startPollingForAnalysis() {
    setIsAnalysisPending(true);

    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(() => {
      refetchApplicants();
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
        refetchApplicants(),
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
      // Reset analysis state
      const token = sessionStorage.getItem('idToken');
      
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
      }

      const payload: Record<string, any> = { job_id: jobToShow.pk };
      // Ya no se envían requisitos adicionales
      const response = await axiosInstance.post(
        `${CONFIG.apiUrl}/recruiter/${jobId}/analyze-job-cvs`,
        payload
      );

      if (response.status === 200 || response.status === 202 || response.status === 201) {
        // Analysis started successfully
        showToast('Análisis iniciado correctamente', 'success');
        // Iniciar polling para obtener resultados
        startPollingForAnalysis();
        // Analysis started successfully
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

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este candidato?')) {
      return;
    }

    setDeletingCandidates(prev => new Set(prev).add(candidateId));

    try {
      await deleteApplication(candidateId);
      showToast('Candidato eliminado exitosamente', 'success');
      refetchApplicants(); // Recargar la lista de candidatos
    } catch (error: any) {
      showToast(error.message || 'Error al eliminar el candidato', 'error');
    } finally {
      setDeletingCandidates(prev => {
        const newSet = new Set(prev);
        newSet.delete(candidateId);
        return newSet;
      });
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
          city={jobToShow.city}
          province={jobToShow.province}
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
            id: String(a.id || idx),
            name: a.fullName || 'Sin nombre',
            email: a.email || 'Email no disponible',
            score: Number(a.score || 0),
            status: (a.status as 'Revisado' | 'Bueno' | 'Malo' | 'Sin revisar') || 'Sin revisar',
            reasons: a.rawReasons || [],
          }))}
          isLoading={false}
          error={null}
          refetch={refetchApplicants}
          onAddCandidate={() => setShowDropzone(true)} // ⟵ muestra dropzone
          onAnalyze={handleAnalyze} // ⟵ analiza CVs
          canAnalyze={!isAnalyzing} // ⟵ deshabilitado mientras analiza
          isAnalyzing={isAnalyzing} // ⟵ estado de carga
          onDeleteCandidate={handleDeleteCandidate} // ⟵ elimina candidato
          deletingCandidates={deletingCandidates} // ⟵ candidatos siendo eliminados
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
