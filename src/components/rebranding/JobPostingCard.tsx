import React from "react";
import {
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

interface JobPostingCardProps {
  id: string;
  title: string;
  company: string;
  status: "Activo" | "Pausado" | "Cerrado";
  modality: "Presencial" | "Remoto" | "Híbrido";
  type: "Tiempo Completo" | "Medio Tiempo" | "Contrato";
  location: string;
  publishedAt: string; // e.g. "Publicado hace 2 días"
  description: string;
  candidatesCount: number;
  salaryRange: string; // e.g. "45.000 - 65.000 €"
  onJobClick?: (jobId: string) => void;
}

export const JobPostingCard: React.FC<JobPostingCardProps> = ({
  id,
  title,
  company,
  status,
  modality,
  type,
  location,
  publishedAt,
  description,
  candidatesCount,
  salaryRange,
  onJobClick,
}) => {
  // Helper para estilos de estado
  const statusColors: Record<string, string> = {
    Activo: "bg-green-100 text-green-700",
    Pausado: "bg-yellow-100 text-yellow-700",
    Cerrado: "bg-red-100 text-red-700",
  };

  const modalityColors: Record<string, string> = {
    Presencial: "bg-orange-100 text-orange-700",
    Remoto: "bg-blue-100 text-blue-700",
    Híbrido: "bg-purple-100 text-purple-700",
  };

  const handleCardClick = () => {
    if (onJobClick) {
      onJobClick(id);
    }
  };

  return (
    <div 
      className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{company}</p>
        </div>
        <button className="p-1 text-gray-500 hover:text-gray-700">
          <EllipsisVerticalIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mt-2 flex-wrap">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${modalityColors[modality]}`}>
          {modality}
        </span>
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {type}
        </span>
      </div>

      {/* Meta info */}
      <div className="flex gap-4 mt-3 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <MapPinIcon className="w-4 h-4" /> {location}
        </span>
        <span className="flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" /> {publishedAt}
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-700 line-clamp-2">{description}</p>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex gap-4 text-gray-600">
          <span className="flex items-center gap-1">
            <UserGroupIcon className="w-4 h-4 text-green-600" />
            <span className="font-medium">{candidatesCount}</span> candidatos
          </span>
        </div>
        <span className="text-purple-600 font-medium">{salaryRange}</span>
      </div>
    </div>
  );
};
