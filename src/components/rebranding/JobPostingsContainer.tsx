import React from "react";
import { JobPostingCard } from "./JobPostingCard";

interface Job {
  id: string;
  title: string;
  company: string;
  status: "Activo" | "Pausado" | "Cerrado";
  modality: "Presencial" | "Remoto" | "Híbrido";
  type: "Tiempo Completo" | "Medio Tiempo" | "Contrato";
  location: string;
  publishedAt: string;
  description: string;
  candidatesCount: number;
  salaryRange: string;
}

interface JobPostingsContainerProps {
  jobs: Job[];
  isLoading: boolean;
  hasMore: boolean;
  error: unknown;
  refetch: () => void;
  onJobClick?: (jobId: string) => void;
  onDeleteJob?: (jobId: string) => void;
}

export const JobPostingsContainer: React.FC<JobPostingsContainerProps> = ({
  jobs,
  isLoading,
  hasMore,
  error,
  refetch,
  onJobClick,
  onDeleteJob,
}) => {
  if (isLoading && !hasMore) {
    return <p className="p-6 text-gray-500">Cargando trabajos...</p>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 space-y-2">
        <p>Ocurrió un error al cargar los trabajos.</p>
        <button
          onClick={refetch}
          className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!jobs.length) {
    return <p className="p-6 text-gray-500">No hay trabajos publicados.</p>;
  }

  return (
    <div className="p-6 space-y-4">
      {jobs.map((job) => (
        <JobPostingCard 
          key={job.id} 
          {...job} 
          onJobClick={onJobClick}
          onDelete={onDeleteJob}
        />
      ))}
    </div>
  );
};
