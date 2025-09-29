import { Job } from "@/context/JobContext";
import { JobSearchFilters } from "./JobSearchFilters";
import { JobCard } from "./JobCard";

interface JobListSidebarProps {
  jobs: Job[];
  selectedJob: Job | null;
  onJobSelect: (job: Job) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
  isLoading?: boolean;
}

export const JobListSidebar = ({
  jobs,
  selectedJob,
  onJobSelect,
  searchTerm,
  onSearchChange,
  locationFilter,
  onLocationChange,
  typeFilter,
  onTypeChange,
  isLoading = false,
}: JobListSidebarProps) => {
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const jobLocation = job.city && job.province ? `${job.city}, ${job.province}` : job.city || job.province || '';
    const matchesLocation = !locationFilter || jobLocation.includes(locationFilter);
    const matchesType = !typeFilter || job.contract_type === typeFilter;

    return matchesSearch && matchesLocation && matchesType;
  });

  if (isLoading) {
    return (
      <div className="w-96 border-r bg-white flex flex-col">
        <JobSearchFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          locationFilter={locationFilter}
          onLocationChange={onLocationChange}
          typeFilter={typeFilter}
          onTypeChange={onTypeChange}
        />
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="text-center text-gray-500 py-8">Cargando trabajos...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 border-r bg-white flex flex-col">
      <JobSearchFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        locationFilter={locationFilter}
        onLocationChange={onLocationChange}
        typeFilter={typeFilter}
        onTypeChange={onTypeChange}
      />

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredJobs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No se encontraron trabajos que coincidan con los filtros.
            </div>
          ) : (
            filteredJobs.map((job) => (
              <JobCard
                key={job.pk}
                job={job}
                isSelected={selectedJob?.pk === job.pk}
                onClick={() => onJobSelect(job)}
                applicantsCount={0}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
