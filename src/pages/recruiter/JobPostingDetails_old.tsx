import { useNavigate, useParams } from 'react-router-dom';
import { useGetJobById } from '@/hooks/useGetJobById.ts';
import { useUpdateJobPostingData } from '@/hooks/useUpdateJobPostingData';
import { CVDropzone } from '@/components/other/CVDropzone.tsx';
import { useState, useEffect, useRef } from 'react';
import AnalysisButton from '@/components/other/AnalysisButton.tsx';
import { useGetApplicantsByJobId, useGetTop3ApplicantsByJobId } from '@/hooks/useGetApplicantsByJobId.ts';
import { useGetJobMetrics } from '@/hooks/useGetJobMetrics.ts';
import { useGetAnalysisResults} from '@/hooks/useGetAnalysisResults';
import TopApplicantsDisplay from '@/components/other/TopApplicantsDisplay.tsx';
import BackButton from '@/components/other/BackButton.tsx';
import { BriefcaseIcon, UsersIcon, ChartBarIcon, CalculatorIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { JobDetailsCard } from '@/components/rebranding/JobPostingDetails/JobDetailsCard';
import { JobPostingStats } from '@/components/rebranding/JobPostingDetails/JobPostingStats';
import { CandidateList } from '@/components/rebranding/JobPostingDetails/CandidateList';
import JobRequirementsDisplay from '@/components/other/JobRequirementsDisplay.tsx';

import { getPermissionsByStatus, JobPostingStatus } from '../recruiter/jp_elements/jobPostingPermissions';
import type { Job } from '@/context/JobContext';
import { useToast } from '@/context/ToastContext';

// Helpers for displaying enum labels
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

  // New editable fields state
  const [isEditingFields, setIsEditingFields] = useState(false);
  const [newSeniority, setNewSeniority] = useState<'JUNIOR' | 'SEMISENIOR' | 'SENIOR' | ''>('');
  const [newTipoContrato, setNewTipoContrato] = useState<'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP' | ''>('');
  const [newUbicacion, setNewUbicacion] = useState('');
  const [newEmpresa, setNewEmpresa] = useState('');
  const [newEnglishLevel, setNewEnglishLevel] = useState<'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE' | 'NOT_REQUIRED' | ''>('');
  
  const [newModal, setNewModal] = useState<'REMOTE' | 'ONSITE' | 'HYBRID' | ''>('');

  
  const [extraRequirements, setExtraRequirements] = useState<any | undefined>(undefined); // Changed type to any as per new_code
  const [localJob, setLocalJob] = useState<Job | null>(null);
  const [isAnalysisPending, setIsAnalysisPending] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { showToast } = useToast();

  

  const jobToShow = localJob || job;
  const cleanJobId = jobToShow?.pk ? jobToShow.pk.replace(/^JD#/, '') : '';
  const { applicants, refetch: refetchApplicants } = useGetApplicantsByJobId(cleanJobId);
  const { top3Applicants, refetch: refetchTop3Applicants } = useGetTop3ApplicantsByJobId(cleanJobId);
  const { results: analysisResults, refetch: refetchAnalysisResults } = useGetAnalysisResults(cleanJobId);
  const { metrics, isLoading: metricsLoading, error: metricsError, refetchMetrics } = useGetJobMetrics(cleanJobId);

  // Navigate to full analysis view
  const analysisDetailsPath = `/recruiter/job/${cleanJobId}/analysis`;
  const goToFullAnalysis = () => navigate(analysisDetailsPath);

  // Sync status from job
  useEffect(() => {
    if (jobToShow && ['ACTIVE', 'INACTIVE', 'CANCELLED', 'DELETED'].includes(jobToShow.status as string)) {
      setSelectedStatus(jobToShow.status as JobPostingStatus);
    }
  }, [jobToShow?.status]);

  // Clear pending state when we have analysis results or metrics
  useEffect(() => {
    if (isAnalysisPending) {
      const hasAnalysisResults = analysisResults && analysisResults.length > 0;
      const hasMetrics = metrics && metrics.total_analyzed > 0;
      
      if (hasAnalysisResults || hasMetrics) {
        console.log('✅ Analysis results detected, clearing pending state');
        setIsAnalysisPending(false);
        
        // Clear the polling interval
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    }
  }, [analysisResults, metrics, isAnalysisPending]);

  // Cleanup polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Permissions based on current status
  const { canEditFields, canAddCVs, canChangeStatus } = getPermissionsByStatus(selectedStatus);

  // Handlers
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
  const handleRequirementsUpdate = (updates: any) => {
    setExtraRequirements(updates);
  };

  

  

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
      {/* Metrics */}
      <div className="w-full">
        <JobPostingStats
          totalAnalyzed={metrics?.total_analyzed || 0}
          avgScore={typeof metrics?.average_score === 'number' ? Number(metrics?.average_score.toFixed(1)) : Number(metrics?.average_score || 0)}
          highestScore={{
            value: typeof metrics?.highest_score === 'number' ? Number(metrics?.highest_score.toFixed(1)) : Number(metrics?.highest_score || 0),
            name: metrics?.highest_score_applicant_name || '-'
          }}
          lowestScore={{
            value: typeof metrics?.lowest_score === 'number' ? Number(metrics?.lowest_score.toFixed(1)) : Number(metrics?.lowest_score || 0),
            name: metrics?.lowest_score_applicant_name || '-'
          }}
        />
            </div>

      <div className="w-full flex flex-row gap-8 items-start">
        {/* Left: Job details card */}
        <div className="hidden lg:block w-full max-w-sm">
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
        {/* Center: Candidate list */}
        <div className="flex-1 min-w-0">
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
            onAddCandidate={() => console.log('Agregar candidatos')}
              />
          </div>

         </div>
       </div>
  );
};

export default JobPostingDetails;
