import React, { useState, useRef, useEffect } from "react";
import {
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  EllipsisVerticalIcon,
  TrashIcon,
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
  onDelete?: (jobId: string) => void;
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
  onDelete,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se active el click del card
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevenir que se active el click del card
    if (onDelete) {
      onDelete(id);
    }
    setIsMenuOpen(false);
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
        <div className="relative" ref={menuRef}>
          <button 
            className="p-1 text-gray-500 hover:text-gray-700"
            onClick={handleMenuClick}
          >
            <EllipsisVerticalIcon className="w-5 h-5" />
          </button>
          
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Eliminar puesto
                </button>
              </div>
            </div>
          )}
        </div>
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
