import { useEffect, useState } from "react";
import JobSearchBar from "../../components/candidate/JobSearchBar.tsx";
import JobSearchAdvancedFilters from "../../components/candidate/JobSearchAdvancedFilters";
import JobSearchResults from "../../components/candidate/JobSearchResults";
import { JobSearchFilters } from "@/types/candidate.ts";
import { useApplyToJob } from '@/hooks/useApplyToJob';
import ApplyConfirmationModal from '@/components/other/ApplyConfirmationModal';
import ToastNotification from '@/components/other/ToastNotification';

const JobSearch = () => {
  const [filters, setFilters] = useState<JobSearchFilters>({ title: "" });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(true);
  const { apply, isLoading: isApplying, success, error } = useApplyToJob();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (success) {
      setIsModalOpen(false);
      setToastMessage("Te postulaste con éxito");
      setToastType("success");
      setShowToast(true);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastType("error");
      setShowToast(true);
    }
  }, [error]);

  const handleChange = (field: keyof JobSearchFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setIsLoading(true);
    console.log("Filtros enviados al backend:", filters);
    // TODO: Llamada real a la API
    setTimeout(() => {
      setIsLoading(false);
      setHasResults(true); // Cambia a false si la API no devuelve nada
    }, 1000);
  };

  const handleApplyClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const handleConfirmApply = () => {
    apply(selectedJobId);
  };

  return (
      <div className="min-h-screen bg-blue-100 flex flex-col items-center py-10 px-4 gap-6">
        <div className="w-full max-w-4xl flex flex-col gap-4">
          <JobSearchBar
              title={filters.title}
              onTitleChange={(v) => handleChange("title", v)}
              onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
          />

          {showAdvanced && (
              <JobSearchAdvancedFilters filters={filters} onChange={handleChange} />
          )}

          <div className="flex justify-end">
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Buscar
            </button>
          </div>

          <JobSearchResults isLoading={isLoading} hasResults={hasResults} onApply={handleApplyClick} />
          <ApplyConfirmationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmApply}
            isLoading={isApplying}
          />
          <ToastNotification
            message={toastMessage}
            type={toastType}
            isVisible={showToast}
            onClose={() => setShowToast(false)}
          />
        </div>
      </div>
  );
};

export default JobSearch;
