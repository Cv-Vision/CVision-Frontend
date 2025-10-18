import React, { useState } from "react";
import { CandidateScoreCard } from "./CandidateScoreCard";
import { UserGroupIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CandidateDetailsModal } from "./CandidateDetailsModal";

interface Candidate {
  id: string;
  name: string;
  email: string;
  score: number;
  status: "Revisado" | "Bueno" | "Malo" | "Sin revisar";
  reasons?: string[];
}

interface CandidateListProps {
  candidates: Candidate[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  onAddCandidate: () => void;
  onAnalyze?: () => void;
  canAnalyze?: boolean;
  isAnalyzing?: boolean;
  onDeleteCandidate?: (candidateId: string) => void;
  deletingCandidates?: Set<string>;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  isLoading,
  error,
  refetch,
  onAddCandidate,
  onAnalyze,
  canAnalyze = false,
  isAnalyzing = false,
  onDeleteCandidate,
  deletingCandidates = new Set(),
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("score");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <p className="p-4 text-gray-500">Cargando candidatos...</p>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 space-y-2">
        <p>Ocurrió un error al cargar los candidatos.</p>
        <button
          onClick={refetch}
          className="px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Filtrado y búsqueda
  const filteredCandidates = candidates
    .filter((c) => {
      if (filter === "all") return true;
      return c.status === filter;
    })
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "score") return b.score - a.score;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4 border">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <UserGroupIcon className="w-5 h-5" />
          Candidatos ({candidates.length})
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddCandidate}
            className="flex items-center gap-2 px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar Candidatos
          </button>
          {onAnalyze && (
            <button
              onClick={onAnalyze}
              disabled={!canAnalyze || isAnalyzing}
              className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors ${
                canAnalyze && !isAnalyzing
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analizando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Nuevo Análisis
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Buscar candidatos por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg text-sm"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-2 py-1 rounded-lg text-sm"
        >
          <option value="all">Todos</option>
          <option value="Revisado">Revisado</option>
          <option value="Bueno">Bueno</option>
          <option value="Malo">Malo</option>
          <option value="Sin revisar">Sin revisar</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border px-2 py-1 rounded-lg text-sm"
        >
          <option value="score">Puntuación</option>
          <option value="name">Nombre</option>
        </select>
      </div>

      {/* Candidate cards */}
      <div className="space-y-3">
        {filteredCandidates.map((c) => (
          <CandidateScoreCard
            key={c.id}
            name={c.name}
            email={c.email}
            score={c.score}
            status={c.status}
            onDownloadCV={() => console.log("Descargar CV", c.id)}
            onContact={() => console.log("Contactar", c.id)}
            onDelete={() => onDeleteCandidate?.(c.id)}
            isDeleting={deletingCandidates.has(c.id)}
            onClick={() => {
              setSelected(c);
              setOpen(true);
            }}
          />
        ))}
      </div>

      {/* Modal de detalles */}
      <CandidateDetailsModal
        isOpen={open}
        onClose={() => setOpen(false)}
        candidate={selected ? {
          id: selected.id,
          name: selected.name,
          email: selected.email,
          score: selected.score,
          status: selected.status,
          reasons: selected.reasons || [],
        } : null}
      />
    </div>
  );
};
