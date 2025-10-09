import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { JobSearchFilters } from "@/types/applicant.ts";
import { useApplyToJob } from '@/hooks/useApplyToJob';
import { usePublicJobSearch } from '@/hooks/usePublicJobSearch';
import ApplyConfirmationModal from '@/components/other/ApplyConfirmationModal';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/context/JobContext';
import JobQuestionsModal from '@/components/applicant/JobQuestionsModal';
import GuestApplicantModal, { GuestApplicationData } from '@/components/other/GuestApplicantModal';
import { useCheckJobHasQuestions } from '@/hooks/useCheckJobHasQuestions';
import { JobListingHeader } from '@/components/applicant/JobListingHeader';
import { JobListSidebar } from '@/components/applicant/JobListSidebar';
import { JobDetails } from '@/components/applicant/JobDetails';

const JobSearch = () => {
  const navigate = useNavigate();
  const [filters] = useState<JobSearchFilters>({ title: "" });
  const [, setPage] = useState(1);
  const { jobs, isLoading: isLoadingSearch, error: searchError, search, hasMore } = usePublicJobSearch();
  const { apply, isLoading: isApplying, success, error: applyError } = useApplyToJob();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const { showToast } = useToast();
  const { isAuthenticated } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedJobForQuestions, setSelectedJobForQuestions] = useState<{id: string, title: string} | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedJobForGuest, setSelectedJobForGuest] = useState<{id: string, title: string} | null>(null);
  const [showGuestRegisterMessage, setShowGuestRegisterMessage] = useState(false);
  
  const { hasQuestions, checkForQuestions } = useCheckJobHasQuestions();
  
  // New state for the modern UI
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    search(filters, 1, 10, false);
    setPage(1);
  }, [filters, search]);

  // Set first job as selected when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]);
    }
  }, [jobs, selectedJob]);

  useEffect(() => {
    if (success) {
      setIsModalOpen(false);
      showToast('Te postulaste con éxito', 'success');
      setAppliedJobs(prev => [...prev, selectedJobId]);


      const selectedJob = jobs.find(job => job.pk === selectedJobId);
      if (selectedJob) {
        setSelectedJobForQuestions({ id: selectedJobId, title: selectedJob.title });
        setShowQuestionsModal(true);
      }
    }
  }, [success, selectedJobId, jobs]);

  useEffect(() => {
    if (applyError) {
      showToast(applyError, 'error');
    }
  }, [applyError]);
  
  useEffect(() => {
    if (searchError) {
      showToast(searchError, 'error');
    }
  }, [searchError]);


  useEffect(() => {
    if (hasQuestions && appliedJobs.length > 0) {
      setTimeout(() => {
        setShowGuestRegisterMessage(true);
      }, 1500);
    }
  }, [hasQuestions, appliedJobs.length]);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    if (!isLoadingSearch && hasMore) {
      setPage(prev => {
        const next = prev + 1;
        search(filters, next, 10, true);
        return next;
      });
    }
  }, [isLoadingSearch, hasMore, search, filters]);


  const handleConfirmApply = () => {
    apply(selectedJobId);
  };

  const handleGuestApply = async (applicationData: GuestApplicationData) => {

    showToast('Aplicación enviada exitosamente', 'success');
    setAppliedJobs(prev => [...prev, applicationData.jobId]);
    

    await checkForQuestions(applicationData.jobId);
  };

  const handleApply = (jobId: string) => {
    if (!isAuthenticated) {
      // Show guest modal instead of redirecting
      const job = jobs.find(job => job.pk === jobId);
      if (job) {
        setSelectedJobForGuest({ id: jobId, title: job.title });
        setShowGuestModal(true);
      }
      return;
    }

    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleBackClick = () => {
    navigate(isAuthenticated ? "/applicant/dashboard" : "/");
  };

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingSearch) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [loadMore, hasMore, isLoadingSearch]);

  return (
    <div className="min-h-screen bg-background">
      <JobListingHeader onBackClick={handleBackClick} />

      <div className="flex h-[calc(100vh-73px)]">
        <JobListSidebar
          jobs={jobs as Job[]}
          selectedJob={selectedJob}
          onJobSelect={handleJobSelect}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          isLoading={isLoadingSearch}
        />

        {/* Job Details */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedJob ? (
            <JobDetails
              job={selectedJob}
              onApply={() => handleApply(selectedJob.pk)}
              isApplying={isApplying && selectedJobId === selectedJob.pk}
              applicantsCount={0}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">Selecciona un trabajo para ver los detalles</p>
                <p className="text-sm">Usa los filtros para encontrar trabajos que te interesen</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ApplyConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmApply}
        isLoading={isApplying}
      />
      
      <JobQuestionsModal
        isOpen={showQuestionsModal}
        onClose={() => {
          setShowQuestionsModal(false);
          setSelectedJobForQuestions(null);
        }}
        jobId={selectedJobForQuestions?.id || ''}
        jobTitle={selectedJobForQuestions?.title}
      />
      
      <GuestApplicantModal
        isOpen={showGuestModal}
        onClose={() => {
          setShowGuestModal(false);
          setSelectedJobForGuest(null);
        }}
        jobId={selectedJobForGuest?.id || ''}
        jobTitle={selectedJobForGuest?.title || ''}
        onApply={handleGuestApply}
      />
      
      {/* Modal de preguntas bloqueado para guests */}
      <JobQuestionsModal
        isOpen={showGuestRegisterMessage}
        onClose={() => setShowGuestRegisterMessage(false)}
        jobId=""
        showGuestRegisterMessage={true}
      />

      {/* Infinite scroll trigger */}
      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default JobSearch;
