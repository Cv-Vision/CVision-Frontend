import { useEffect, useState } from "react";
import JobSearchBar from "@/components/applicant/JobSearchBar.tsx";
import JobSearchAdvancedFilters from "@/components/applicant/JobSearchAdvancedFilters";
import JobSearchResults from "@/components/applicant/JobSearchResults";
import { JobSearchFilters } from "@/types/applicant.ts";
import { useApplyToJob } from '@/hooks/useApplyToJob';
import { usePublicJobSearch } from '@/hooks/usePublicJobSearch';
import ApplyConfirmationModal from '@/components/other/ApplyConfirmationModal';
import ToastNotification from '@/components/other/ToastNotification';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/context/JobContext';
import BackButton from '@/components/other/BackButton.tsx';
import JobQuestionsModal from '@/components/applicant/JobQuestionsModal';

const JobSearch = () => {
  const [filters, setFilters] = useState<JobSearchFilters>({ title: "" });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const { jobs, isLoading: isLoadingSearch, error: searchError, search } = usePublicJobSearch();
  const { apply, isLoading: isApplying, success, error: applyError } = useApplyToJob();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const { user, isAuthenticated } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);
  const [selectedJobForQuestions, setSelectedJobForQuestions] = useState<{id: string, title: string} | null>(null);

  useEffect(() => {
    search({});
  }, [search]);

  useEffect(() => {
    if (success) {
      setIsModalOpen(false);
      setToastMessage("Te postulaste con éxito");
      setToastType("success");
      setShowToast(true);
      setAppliedJobs(prev => [...prev, selectedJobId]);

      // Mostrar modal de preguntas después de aplicación exitosa
      const selectedJob = jobs.find(job => job.pk === selectedJobId);
      if (selectedJob) {
        setSelectedJobForQuestions({ id: selectedJobId, title: selectedJob.title });
        setShowQuestionsModal(true);
      }
    }
  }, [success, selectedJobId, jobs]);

  useEffect(() => {
    if (applyError) {
      setToastMessage(applyError);
      setToastType("error");
      setShowToast(true);
    }
  }, [applyError]);
  
  useEffect(() => {
    if (searchError) {
      setToastMessage(searchError);
      setToastType("error");
      setShowToast(true);
    }
  }, [searchError]);

  const handleChange = (field: keyof JobSearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    search(filters);
    setCurrentPage(1);
  };

  const handleConfirmApply = () => {
    apply(selectedJobId);
  };

  const handleApply = (jobId: string) => {
    if (!isAuthenticated) {
      // Redirect to login page with state
      window.location.href = "/login?fromJobListings=true";
      return;
    }

    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-y-auto">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="w-full flex flex-col gap-6">
            {/* Botón de volver usando el componente BackButton */}
            <div className="w-full flex justify-start mb-6">
              <BackButton to={isAuthenticated ? "/applicant/dashboard" : "/"} />
            </div>

            <JobSearchBar
                title={filters.title}
                onTitleChange={(v) => handleChange("title", v)}
                onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
            />

            {showAdvanced && (
                <JobSearchAdvancedFilters filters={filters} onChange={handleChange} />
            )}

            <div className="flex justify-center">
              <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 hover:scale-105"
              >
                Buscar
              </button>
            </div>

            <JobSearchResults
              isLoading={isLoadingSearch}
              hasResults={jobs.length > 0}
              jobs={jobs as Job[]}
              onApply={handleApply}
              appliedJobs={appliedJobs}
              isApplying={isApplying}
              applyingJobId={selectedJobId}
              isAuthenticated={isAuthenticated}
              userRole={user?.role}
              currentPage={currentPage}
              jobsPerPage={jobsPerPage}
              onPageChange={setCurrentPage}
              totalJobs={jobs.length}
            />
            <ApplyConfirmationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleConfirmApply}
              isLoading={isApplying}
            />
            {showToast && (
              <ToastNotification
                message={toastMessage}
                type={toastType}
                onClose={() => setShowToast(false)}
              />
            )}
          </div>
        </div>
        <JobQuestionsModal
          isOpen={showQuestionsModal}
          onClose={() => {
            setShowQuestionsModal(false);
            setSelectedJobForQuestions(null);
          }}
          jobId={selectedJobForQuestions?.id || ''}
          jobTitle={selectedJobForQuestions?.title}
        />
      </div>
  );
};

export default JobSearch;
