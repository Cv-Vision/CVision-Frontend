import { MapPin, Clock, Building2, CheckCircle, XCircle, ClockIcon, Calendar } from "lucide-react";
import { Application } from '../../hooks/useUserApplications';

interface ApplicationDetailsProps {
  application: Application;
}

export const ApplicationDetails = ({ application }: ApplicationDetailsProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'Pending':
      default:
        return <ClockIcon className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Accepted':
        return 'Aceptada';
      case 'Rejected':
        return 'Rechazada';
      case 'Pending':
      default:
        return 'Pendiente';
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'Accepted':
        return '¡Felicitaciones! Tu aplicación ha sido aceptada. El reclutador se pondrá en contacto contigo pronto.';
      case 'Rejected':
        return 'Tu aplicación no ha sido seleccionada para este puesto. No te desanimes, sigue aplicando a otros trabajos.';
      case 'Pending':
      default:
        return 'Tu aplicación está siendo revisada por el reclutador. Te notificaremos cuando tengamos una respuesta.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl text-gray-900 font-bold">{application.jobPosting.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  {application.jobPosting.company}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {application.jobPosting.location || 'Ubicación no especificada'}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Aplicado el {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'Fecha no disponible'}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusIcon(application.status)}
              <span className={`px-4 py-2 rounded-lg border font-medium ${getStatusColor(application.status)}`}>
                {getStatusLabel(application.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Message */}
          <div className={`p-4 rounded-lg border ${getStatusColor(application.status)}`}>
            <div className="flex items-start space-x-3">
              {getStatusIcon(application.status)}
              <div>
                <h3 className="font-semibold text-lg mb-2">Estado de tu aplicación</h3>
                <p className="text-sm leading-relaxed">
                  {getStatusMessage(application.status)}
                </p>
              </div>
            </div>
          </div>

          {/* Application Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Fecha de aplicación</p>
              <p className="font-medium text-gray-900">
                {application.createdAt ? new Date(application.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Fecha no disponible'}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Estado actual</p>
              <p className="font-medium text-gray-900">{getStatusLabel(application.status)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Empresa</p>
              <p className="font-medium text-gray-900">{application.jobPosting.company}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Ubicación</p>
              <p className="font-medium text-gray-900">
                {application.jobPosting.location || 'No especificada'}
              </p>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción del Puesto</h3>
            <p className="text-gray-700 leading-relaxed">
              {application.jobPosting.description || 'No hay descripción disponible para este puesto.'}
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-teal-50 p-6 rounded-lg border border-teal-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Próximos pasos</h3>
            {application.status === 'Pending' && (
              <div className="space-y-2">
                <p className="text-gray-700">• Tu aplicación está siendo revisada por el equipo de recursos humanos</p>
                <p className="text-gray-700">• Te notificaremos por email cuando tengamos una respuesta</p>
                <p className="text-gray-700">• Mientras tanto, puedes seguir explorando otros puestos disponibles</p>
              </div>
            )}
            {application.status === 'Accepted' && (
              <div className="space-y-2">
                <p className="text-gray-700">• ¡Felicitaciones! El reclutador se pondrá en contacto contigo</p>
                <p className="text-gray-700">• Prepárate para la siguiente etapa del proceso de selección</p>
                <p className="text-gray-700">• Revisa tu email regularmente para futuras comunicaciones</p>
              </div>
            )}
            {application.status === 'Rejected' && (
              <div className="space-y-2">
                <p className="text-gray-700">• No te desanimes, cada aplicación es una oportunidad de aprendizaje</p>
                <p className="text-gray-700">• Considera revisar tu perfil y CV para futuras aplicaciones</p>
                <p className="text-gray-700">• Sigue explorando otros puestos que se ajusten a tu perfil</p>
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sobre {application.jobPosting.company}</h3>
            <p className="text-gray-700 mb-4">
              Información de la empresa no disponible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
