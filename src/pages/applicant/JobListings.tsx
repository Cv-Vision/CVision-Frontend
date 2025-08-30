import { useEffect, useState } from "react";
import JobSearchBar from "@/components/applicant/JobSearchBar.tsx";
import JobSearchAdvancedFilters from "@/components/applicant/JobSearchAdvancedFilters";
import JobSearchResults from "@/components/applicant/JobSearchResults";
import { JobSearchFilters } from "@/types/applicant.ts";
import { useApplyToJob } from '@/hooks/useApplyToJob';
import { useGetJobs } from '@/hooks/useGetJobs';
import ApplyConfirmationModal from '@/components/other/ApplyConfirmationModal';
import ToastNotification from '@/components/other/ToastNotification';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/context/JobContext';
import BackButton from '@/components/other/BackButton.tsx';

const JobSearch = () => {
  const [filters, setFilters] = useState<JobSearchFilters>({ title: "" });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const { jobs, isLoading: isLoadingJobs, error: jobsError } = useGetJobs();
  const { apply, isLoading: isApplying, success, error: applyError } = useApplyToJob();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const { user, isAuthenticated } = useAuth();
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  useEffect(() => {
    if (success) {
      setIsModalOpen(false);
      setToastMessage("Te postulaste con éxito");
      setToastType("success");
      setShowToast(true);
      setAppliedJobs(prev => [...prev, selectedJobId]);
    }
  }, [success]);

  useEffect(() => {
    if (applyError) {
      setToastMessage(applyError);
      setToastType("error");
      setShowToast(true);
    }
  }, [applyError]);
  
  useEffect(() => {
    if (jobsError) {
      setToastMessage(jobsError);
      setToastType("error");
      setShowToast(true);
    }
  }, [jobsError]);

  const handleChange = (field: keyof JobSearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // Filtrar trabajos basados en los filtros aplicados
  useEffect(() => {
    filterJobs();
  }, [jobs]);

  const filterJobs = () => {
    if (jobs.length === 0) return;
    
    let results = [...jobs];
    
    if (filters.title) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    
    if (filters.company) {
      results = results.filter(job => 
        job.company.toLowerCase().includes(filters.company!.toLowerCase())
      );
    }

    if (filters.industry) {
      results = results.filter(job => 
        job.industry_experience?.industry?.toLowerCase().includes(filters.industry!.toLowerCase())
      );
    }

    if (filters.contractType) {
      results = results.filter(job => 
        job.contract_type?.toLowerCase() === filters.contractType!.toLowerCase()
      );
    }

    if (filters.seniorityLevel) {
      results = results.filter(job => 
        job.experience_level?.toLowerCase() === filters.seniorityLevel!.toLowerCase()
      );
    }
    
    setFilteredJobs(results);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    filterJobs();
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
              isLoading={isLoadingJobs}
              hasResults={filteredJobs.length > 0}
              jobs={filteredJobs}
              onApply={handleApply} // Pass the new handleApply function
              appliedJobs={appliedJobs}
              isApplying={isApplying}
              applyingJobId={selectedJobId}
              isAuthenticated={isAuthenticated}
              userRole={user?.role}
              currentPage={currentPage}
              jobsPerPage={jobsPerPage}
              onPageChange={setCurrentPage}
              totalJobs={filteredJobs.length}
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
      </div>
  );
};

export default JobSearch;
