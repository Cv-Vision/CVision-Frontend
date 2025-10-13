import { MapPin, Clock, Building2, Users } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Job } from "@/context/JobContext";

interface JobDetailsProps {
  job: Job;
  onApply: () => void;
  isApplying?: boolean;
  applicantsCount?: number;
}

export const JobDetails = ({ job, onApply, isApplying = false, applicantsCount = 0 }: JobDetailsProps) => {
  const getContractTypeLabel = (type?: string) => {
    const labels: { [key: string]: string } = {
      'FULL_TIME': 'Tiempo Completo',
      'PART_TIME': 'Medio Tiempo',
      'CONTRACT': 'Contrato',
      'FREELANCE': 'Freelance',
      'INTERNSHIP': 'Prácticas'
    };
    return labels[type || ''] || type || 'No especificado';
  };

  const getModalityLabel = (modal?: string) => {
    const labels: { [key: string]: string } = {
      'REMOTE': 'Remoto',
      'ONSITE': 'Presencial',
      'HYBRID': 'Híbrido'
    };
    return labels[modal || ''] || modal || 'No especificado';
  };

  const getExperienceLevelLabel = (level?: string) => {
    const labels: { [key: string]: string } = {
      'JUNIOR': 'Junior',
      'SEMISENIOR': 'Semi Senior',
      'SENIOR': 'Senior'
    };
    return labels[level || ''] || level || 'No especificado';
  };

  const getEnglishLevelLabel = (level?: string) => {
    const labels: { [key: string]: string } = {
      'BASIC': 'Básico',
      'INTERMEDIATE': 'Intermedio',
      'ADVANCED': 'Avanzado',
      'NATIVE': 'Nativo',
      'NOT_REQUIRED': 'No requerido'
    };
    return labels[level || ''] || level || 'No especificado';
  };

  // Extract requirements from job data
  const requirements = [
    job.experience_level && getExperienceLevelLabel(job.experience_level),
    job.english_level && getEnglishLevelLabel(job.english_level),
    job.contract_type && getContractTypeLabel(job.contract_type),
    job.modal && getModalityLabel(job.modal),
    job.city && job.province ? `${job.city}, ${job.province}` : job.city || job.province || 'Ubicación no especificada'
  ].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl text-gray-900 font-bold">{job.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  {job.company}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {job.city && job.province ? `${job.city}, ${job.province}` : job.city || job.province || 'Ubicación no especificada'}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Publicado recientemente
                </div>
              </div>
            </div>
            <button 
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2 rounded-lg transition-colors disabled:opacity-50"
              onClick={onApply}
              disabled={isApplying}
            >
              {isApplying ? 'Aplicando...' : 'Aplicar Ahora'}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Job Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Tipo de Contrato</p>
              <p className="font-medium text-gray-900">{getContractTypeLabel(job.contract_type)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Modalidad</p>
              <p className="font-medium text-gray-900">{getModalityLabel(job.modal)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Nivel de Experiencia</p>
              <p className="font-medium text-orange-700">{getExperienceLevelLabel(job.experience_level)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Aplicantes</p>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1 text-gray-400" />
                <p className="font-medium text-gray-900">{applicantsCount}</p>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción del Puesto</h3>
            <div className="prose max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-strong:text-gray-900 prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4 prose-li:marker:text-gray-400 prose-pre:bg-gray-100 prose-pre:p-4 prose-code:bg-gray-100 prose-code:p-1 prose-code:font-sans prose-code:text-gray-800">
              <ReactMarkdown>{job.description || 'No hay descripción disponible para este puesto.'}</ReactMarkdown>
            </div>
          </div>

          {/* Requirements */}
          {requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisitos</h3>
              <div className="flex flex-wrap gap-2">
                {requirements.map((req, index) => (
                  <span 
                    key={index} 
                    className="border border-orange-200 text-orange-700 bg-orange-50 px-3 py-1 rounded-full text-sm"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Requirements */}
          {job.additional_requirements && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisitos Adicionales</h3>
              <p className="text-gray-700 leading-relaxed">{job.additional_requirements}</p>
            </div>
          )}

          {/* Company Info */}
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre {job.company}</h3>
            <p className="text-gray-700 mb-4">
              Información de la empresa no disponible.
            </p>
          </div>

          {/* Apply Section */}
          <div className="bg-white border border-orange-200 p-6 rounded-lg">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">¿Te interesa este puesto?</h3>
              <p className="text-gray-600">
                Aplica a esta posición de trabajo.
              </p>
              <button 
                className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-3 rounded-lg transition-colors disabled:opacity-50"
                onClick={onApply}
                disabled={isApplying}
              >
                {isApplying ? 'Aplicando...' : 'Aplicar Ahora'}
              </button>
              <p className="text-xs text-gray-500">Al aplicar, aceptas nuestros términos y condiciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
