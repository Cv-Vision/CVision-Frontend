import { useState } from "react";
import JobSearchBar from "../../components/candidate/JobSearchBar.tsx";
import JobSearchAdvancedFilters from "../../components/candidate/JobSearchAdvancedFilters";
import JobSearchResults from "../../components/candidate/JobSearchResults";
import { JobSearchFilters } from "@/types/candidate.ts";

const JobSearch = () => {
  const [filters, setFilters] = useState<JobSearchFilters>({ title: "" });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResults, setHasResults] = useState(true);

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

          <JobSearchResults isLoading={isLoading} hasResults={hasResults} />
        </div>
      </div>
  );
};

export default JobSearch;
