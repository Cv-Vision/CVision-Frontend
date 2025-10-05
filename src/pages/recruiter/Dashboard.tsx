import { TrashIcon, UsersIcon as UsersOutlineIcon, ArrowTrendingUpIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useGetJobs } from '@/hooks/useGetJobs';
import { useGetTotaApplicants } from '@/hooks/useGetTotaApplicants.ts';
import { useDeleteJobPosting } from '@/hooks/useDeleteJobPosting';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatsSidebar } from '@/components/rebranding/StatsSidebar';
import { JobPostingsContainer } from '@/components/rebranding/JobPostingsContainer';
import { JobPostingHeader } from '@/components/rebranding/JobPostingHeader';
import { useToast } from '@/context/ToastContext';
// import { ProcessCVsButton } from '../../components/ProcessCVsButton.tsx'; parte del boton para procesar CVS.

type JobStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'DELETED';
type StatusFilter = 'all' | JobStatus;

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { jobs, isLoading: jobsLoading, error: jobsError, hasMore, total, refetch: loadJobs } = useGetJobs();
  const totalActiveJobs = jobs.filter(job => job.status === "ACTIVE").length;
  const { totalApplicants } = useGetTotaApplicants();
  const { deleteJobPosting } = useDeleteJobPosting();
  const { showToast } = useToast();

  // Filtering and sorting states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    loadJobs(1, 10, false);
    setPage(1);
  }, [loadJobs]);

  const loadMore = useCallback(() => {
    console.log('Attempting to load more jobs...');
    if (!jobsLoading && hasMore) {
      setPage(prev => {
        const next = prev + 1;
        loadJobs(next, 10, true);
        return next;
      });
    }
  }, [jobsLoading, hasMore, loadJobs]);

  const mainRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    console.log('Setting up intersection observer for infinite scroll...');
    if (!hasMore) return;
    console.log('Has more jobs to load, setting up observer.');
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !jobsLoading) {
          loadMore();
        }
      },
      { 
        root: mainRef.current,
        rootMargin: '200px',
        threshold: 1.0
      }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadMore, hasMore, jobsLoading]);

  const handleJobClick = (jobId: string) => {
    navigate(`/recruiter/job/${jobId}`);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este puesto de trabajo?')) {
      try {
        await deleteJobPosting(jobId);
        showToast('Puesto eliminado exitosamente', 'success');
        loadJobs(); // Recargar la lista de puestos
      } catch (error) {
        showToast('Error al eliminar el puesto', 'error');
      }
    }
  };

  // Handle header actions
  const handleCreateJob = () => {
    navigate('/recruiter/create-job');
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value as StatusFilter);
  };

  const stats = [
    { title: "Puestos Activos", value: totalActiveJobs, trend: "falta_hook", icon: <TrashIcon className="w-5 h-5 text-blue-600" /> },
    { title: "Candidatos Totales", value: totalApplicants, trend: "falta_hook", icon: <UsersOutlineIcon className="w-5 h-5 text-green-600" /> },
    { title: "Tasa de Conversión (mock)", value: "24%", trend: "+5% vs mes anterior", icon: <ArrowTrendingUpIcon className="w-5 h-5 text-purple-600" /> },
    { title: "Tiempo Promedio (mock)", value: "18 días", trend: "-3 días vs anterior", icon: <ClockIcon className="w-5 h-5 text-orange-600" /> },
  ];

  const adaptedJobs = useMemo(() => {
    // First, filter out DELETED jobs
    let visibleJobs = jobs.filter(job => job.status !== 'DELETED');
    
    // Apply status filter
    if (statusFilter !== 'all') {
      visibleJobs = visibleJobs.filter(job => job.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      visibleJobs = visibleJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    visibleJobs = [...visibleJobs].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          // Sort by title for now (since we don't have created_at)
          return a.title.localeCompare(b.title);
        case 'oldest':
          return b.title.localeCompare(a.title);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'company':
          return a.company.localeCompare(b.company);
        default:
          return 0;
      }
    });

    // Convert to adapted format
    return visibleJobs.map(job => ({
      id: job.pk,
      title: job.title,
      company: job.company,
      status: job.status === 'ACTIVE' ? 'Activo' as const : 
              job.status === 'INACTIVE' ? 'Pausado' as const : 'Cerrado' as const,
      modality: job.modal === 'REMOTE' ? 'Remoto' as const :
                job.modal === 'ONSITE' ? 'Presencial' as const : 'Híbrido' as const,
      type: job.contract_type === 'FULL_TIME' ? 'Tiempo Completo' as const :
            job.contract_type === 'PART_TIME' ? 'Medio Tiempo' as const : 'Contrato' as const,
      location: job.city && job.province ? `${job.city}, ${job.province}` : job.city || job.province || 'Ubicación no especificada',
      publishedAt: 'Fecha no disponible', // job.created_at no está disponible en el tipo Job
      description: job.description,
      candidatesCount: Math.floor(Math.random() * 50) + 10, // Simulated data
      salaryRange: job.experience_level === 'JUNIOR' ? '25.000 - 35.000 €' :
                   job.experience_level === 'MID' ? '35.000 - 50.000 €' :
                   job.experience_level === 'SENIOR' ? '50.000 - 70.000 €' :
                   job.experience_level === 'LEAD' ? '70.000 - 100.000 €' : 'Salario a convenir'
    }));
  }, [jobs, statusFilter, searchTerm, sortBy]);

  // Prevenir scroll en toda la página
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex overflow-hidden">
      {/* Stats Sidebar */}
      <StatsSidebar stats={stats} />
      
      {/* Main Content */}
      <main ref={mainRef} className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 p-6">
          <div className="flex items-center justify-end">
            <div className="flex gap-3">
              <button
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105"
                onClick={() => navigate('/perfil-reclutador')}
              >
                Mi Perfil
              </button>
            </div>
          </div>
          
          <JobPostingHeader
            totalJobs={total}
            visibleJobs={adaptedJobs.length}
            onCreate={handleCreateJob}
            onSearch={handleSearch}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Job Postings Container */}
        <div className="flex-1 bg-gray-50">
          <JobPostingsContainer 
            jobs={adaptedJobs}
            isLoading={jobsLoading}
            hasMore={hasMore}
            error={jobsError}
            refetch={loadJobs}
            onJobClick={handleJobClick}
            onDeleteJob={handleDeleteJob}
          />
        </div>
        
        {/* Infinite scroll trigger */}
        <div ref={observerRef} className="h-8" />
      </main>
    </div>
  );
};

export default RecruiterDashboard; 
