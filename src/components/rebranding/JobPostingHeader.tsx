import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface JobPostingHeaderProps {
  totalJobs: number;
  visibleJobs: number;
  onSearch: (term: string) => void;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

export const JobPostingHeader: React.FC<JobPostingHeaderProps> = ({
  totalJobs,
  visibleJobs,
  onSearch,
  onSortChange,
  onFilterChange,
}) => {
  return (
    <header className="space-y-4">
      {/* Top row */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Puestos de Trabajo</h1>
          <p className="text-gray-500">Gestiona tus ofertas de empleo</p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-4">
        {/* Search input */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar puestos por título, empresa o descripción..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Sort */}
        <select
          onChange={(e) => onSortChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="recent">Más Recientes</option>
          <option value="oldest">Más Antiguos</option>
        </select>

        {/* Filter */}
        <select
          onChange={(e) => onFilterChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="paused">Pausados</option>
          <option value="closed">Cerrados</option>
        </select>
      </div>

      {/* Jobs counter */}
      <p className="text-sm text-gray-500">
        Mostrando {visibleJobs} de {totalJobs} puestos
      </p>
    </header>
  );
};
