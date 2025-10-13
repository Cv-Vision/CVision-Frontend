import React from "react";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

interface JobDetailsCardProps {
  positionName: string;
  city?: string;
  province?: string;
  modality: string;
  contractType: string;
  level: string;
  salaryRange: string;
  publishedAt: string;
  description: string;
  onViewQuestionsAnswers?: () => void;
}

export const JobDetailsCard: React.FC<JobDetailsCardProps> = ({
  positionName,
  city,
  province,
  modality,
  contractType,
  level,
  salaryRange,
  publishedAt,
  description,
  onViewQuestionsAnswers,
}) => {
  return (
    <aside className="bg-white rounded-xl shadow p-5 space-y-6 border">
      <h2 className="text-lg font-semibold">Detalles del Puesto</h2>

      {/* Nombre del puesto */}
      <div>
        <p className="text-xs font-semibold text-gray-500">NOMBRE DEL PUESTO</p>
        <div className="flex items-center gap-2 mt-1">
          <BuildingOfficeIcon className="w-4 h-4 text-gray-600" />
          <span>{positionName}</span>
        </div>
      </div>

      {/* Ubicación */}
      <div>
        <p className="text-xs font-semibold text-gray-500">UBICACIÓN</p>
        <div className="flex items-center gap-2 mt-1">
          <MapPinIcon className="w-4 h-4 text-gray-600" />
          <span>
            {city && province 
              ? `${city}, ${province}`
              : city || province || 'No especificado'}
          </span>
        </div>
      </div>

      {/* Modalidad */}
      <div>
        <p className="text-xs font-semibold text-gray-500">MODALIDAD</p>
        <span className="inline-block px-2 py-1 text-xs rounded-md border bg-gray-50">
          {modality}
        </span>
      </div>

      {/* Tipo de contrato */}
      <div>
        <p className="text-xs font-semibold text-gray-500">TIPO DE CONTRATO</p>
        <span className="inline-block px-2 py-1 text-xs rounded-md border bg-gray-50">
          {contractType}
        </span>
      </div>

      {/* Nivel */}
      <div>
        <p className="text-xs font-semibold text-gray-500">NIVEL</p>
        <span className="inline-block px-2 py-1 text-xs rounded-md border bg-gray-50">
          {level}
        </span>
      </div>

      {/* Salario */}
      <div>
        <p className="text-xs font-semibold text-gray-500">SALARIO</p>
        <span className="text-purple-600 font-medium">{salaryRange}</span>
      </div>

      {/* Publicado */}
      <div>
        <p className="text-xs font-semibold text-gray-500">PUBLICADO</p>
        <div className="flex items-center gap-2 mt-1">
          <ClockIcon className="w-4 h-4 text-gray-600" />
          <span>{publishedAt}</span>
        </div>
      </div>

      <hr />

      {/* Preguntas y Respuestas */}
      {onViewQuestionsAnswers && (
        <div>
          <h3 className="text-md font-semibold">Preguntas y Respuestas</h3>
          <button
            onClick={onViewQuestionsAnswers}
            className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors"
          >
            Ver Preguntas y Respuestas de Candidatos
          </button>
        </div>
      )}

      <hr />

      {/* Descripción */}
      <div>
        <h3 className="text-md font-semibold">Descripción</h3>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{description}</p>
      </div>
    </aside>
  );
};
