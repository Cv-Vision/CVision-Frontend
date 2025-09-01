import { useEffect, useState } from "react";
import JobSearchBar from "@/components/applicant/JobSearchBar.tsx";
import JobSearchAdvancedFilters from "@/components/applicant/JobSearchAdvancedFilters";
import JobSearchResults from "@/components/applicant/JobSearchResults";
import { JobSearchFilters } from "@/types/applicant.ts";
import { usePublicJobSearch } from '@/hooks/usePublicJobSearch';
import ToastNotification from '@/components/other/ToastNotification';
import { useAuth } from '@/context/AuthContext';
import { Job } from '@/context/JobContext';
import BackButton from '@/components/other/BackButton.tsx';

const JobSearch = () => {
  const [filters, setFilters] = useState<JobSearchFilters>({ title: "" });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const { jobs, isLoading: isLoadingSearch, error: searchError, search } = usePublicJobSearch();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    search({});
  }, [search]);


  
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
              currentPage={currentPage}
              jobsPerPage={jobsPerPage}
              onPageChange={setCurrentPage}
              totalJobs={jobs.length}
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
