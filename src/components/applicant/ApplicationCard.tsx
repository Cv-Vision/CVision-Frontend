import { MapPin, Clock, CheckCircle, XCircle, ClockIcon } from "lucide-react";
import { Application } from '../../hooks/useUserApplications';

interface ApplicationCardProps {
  application: Application;
  isSelected: boolean;
  onClick: () => void;
}

export const ApplicationCard = ({ application, isSelected, onClick }: ApplicationCardProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'PENDING':
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'Aceptada';
      case 'REJECTED':
        return 'Rechazada';
      case 'PENDING':
      default:
        return 'Pendiente';
    }
  };

  return (
    <div
      className={`mb-3 cursor-pointer transition-all hover:shadow-md bg-white border rounded-lg ${
        isSelected
          ? "border-teal-300 bg-teal-50 shadow-sm"
          : "border-gray-200 hover:border-teal-200"
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{application.jobPosting.title}</h3>
            <div className="flex items-center ml-2">
              {getStatusIcon(application.status)}
            </div>
          </div>
          
          <p className="text-sm text-gray-600 font-medium">{application.jobPosting.company}</p>

          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {application.jobPosting.location || 'Ubicación no especificada'}
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Fecha no disponible'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(application.status)}`}>
              {getStatusLabel(application.status)}
            </span>
          </div>

          {application.jobPosting.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
              {application.jobPosting.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
