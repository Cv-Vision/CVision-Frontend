import { MapPin, Clock, Users } from "lucide-react";
import { Job } from "@/context/JobContext";

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
  applicantsCount?: number;
}

export const JobCard = ({ job, isSelected, onClick, applicantsCount = 0 }: JobCardProps) => {
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

  return (
    <div
      className={`mb-3 cursor-pointer transition-all hover:shadow-md bg-white border rounded-lg ${
        isSelected
          ? "border-orange-300 bg-orange-50 shadow-sm"
          : "border-gray-200 hover:border-orange-200"
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
          <p className="text-sm text-gray-600 font-medium">{job.company}</p>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {job.city && job.province ? `${job.city}, ${job.province}` : job.city || job.province || 'Ubicación no especificada'}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Publicado recientemente
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                {getContractTypeLabel(job.contract_type)}
              </span>
              <span className="text-xs border border-orange-200 text-orange-600 px-2 py-1 rounded-full">
                {getModalityLabel(job.modal)}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Users className="w-3 h-3 mr-1" />
              {applicantsCount > 0 ? applicantsCount : 'N/A'}
            </div>
          </div>

          <p className="text-sm font-medium text-orange-700">
            {getExperienceLevelLabel(job.experience_level)}
          </p>
        </div>
      </div>
    </div>
  );
};
