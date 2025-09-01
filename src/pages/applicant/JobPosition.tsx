import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MapPinIcon, BriefcaseIcon, ClockIcon, BuildingOfficeIcon, DocumentTextIcon, StarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useGetJobPosition } from '@/hooks/useGetJobPosition';
import BackButton from '@/components/other/BackButton';
import { useAuth } from '@/context/AuthContext';
import { useApplyToJob } from '@/hooks/useApplyToJob';
import ApplyConfirmationModal from '@/components/other/ApplyConfirmationModal';
import ToastNotification from '@/components/other/ToastNotification';

const JobPosition = () => {
  const { positionId } = useParams<{ positionId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { jobPosition, isLoading, error } = useGetJobPosition(positionId!);
  
  // Determinar si es una vista pública o privada
  const isPublicView = location.pathname.startsWith('/position/');
  
  // Estados para manejar la aplicación al trabajo
  const { apply, isLoading: isApplying, success, error: applyError } = useApplyToJob();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/applicant-register');
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmApply = () => {
    apply(positionId!);
  };

  // Manejar éxito de la aplicación
  useEffect(() => {
    if (success) {
      setIsModalOpen(false);
      setToastMessage("Te postulaste con éxito");
      setToastType("success");
      setShowToast(true);
      setAppliedJobs(prev => [...prev, positionId!]);
    }
  }, [success, positionId]);

  // Manejar error de la aplicación
  useEffect(() => {
    if (applyError) {
      setToastMessage(applyError);
      setToastType("error");
      setShowToast(true);
    }
  }, [applyError]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hace 1 día';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  };

  const getContractTypeDisplay = (contractType?: string) => {
    switch (contractType) {
      case 'FULL_TIME': return 'Full-time';
      case 'PART_TIME': return 'Part-time';
      case 'FREELANCE': return 'Freelance';
      case 'INTERNSHIP': return 'Pasantía';
      default: return contractType || 'No especificado';
    }
  };

  const getWorkModeDisplay = (location?: string) => {
    if (location?.toLowerCase().includes('remoto') || location?.toLowerCase().includes('remote')) {
      return 'Remoto';
    }
    if (location?.toLowerCase().includes('híbrido') || location?.toLowerCase().includes('hybrid')) {
      return 'Híbrido';
    }
    return 'Presencial';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !jobPosition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          <p className="text-red-600 font-medium">
            {error || 'No se pudo cargar la información de la posición'}
          </p>
          <button
            onClick={() => navigate('/applicant/positions')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a las posiciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          {isPublicView ? (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Volver al inicio
            </button>
          ) : (
            <BackButton />
          )}
          <div className="text-sm text-gray-600 mt-2">
            {isPublicView ? 'Oportunidad de trabajo' : 'Portal - ' + jobPosition.title}
          </div>
        </div>

        {/* Public View Banner */}
        {isPublicView && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-sm font-semibold">ℹ️</span>
                </div>
                <div>
                  <p className="text-blue-800 font-medium">Vista pública</p>
                  <p className="text-blue-600 text-sm">Cualquiera puede ver esta posición de trabajo</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/applicant-register')}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Crear cuenta
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Content - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              {/* Company and Job Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-lg">JP</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800">
                        {jobPosition.title}
                      </h1>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      <span>{jobPosition.job_location || jobPosition.location || 'Ubicación no especificada'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BriefcaseIcon className="h-5 w-5 mr-2" />
                      <span>Comercial, Ventas y Negocios</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:text-right mt-4 lg:mt-0">
                  <button
                    onClick={handleApply}
                    disabled={appliedJobs.includes(positionId!) || isApplying}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                  >
                    {isApplying ? 'Aplicando...' : 
                     appliedJobs.includes(positionId!) ? 'Ya aplicado' : 
                     isAuthenticated ? 'Postularse' : 'Iniciar postulación'}
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    {formatDate(jobPosition.created_at)}
                  </p>
                  {!isAuthenticated && (
                    <p className="text-xs text-gray-400 mt-1 max-w-xs">
                      Necesitarás crear una cuenta para completar tu postulación
                    </p>
                  )}
                  {isPublicView && (
                    <button
                      onClick={() => {
                        const url = `${window.location.origin}/position/${positionId}`;
                        navigator.clipboard.writeText(url);
                        // Aquí podrías mostrar un toast de confirmación
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline"
                    >
                      Compartir enlace
                    </button>
                  )}
                </div>
              </div>

              {/* Job Type Pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-full">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    {getContractTypeDisplay(jobPosition.contract_type)}
                  </span>
                </div>
                <div className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-full">
                  <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    {getWorkModeDisplay(jobPosition.location)}
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Descripción del puesto
                  </h3>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  <p className="mb-4">
                    {jobPosition.description}
                  </p>
                  
                  {jobPosition.additional_requirements && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-3">
                        Sus principales responsabilidades serán:
                      </h4>
                      <div className="space-y-2 text-gray-700">
                        {jobPosition.additional_requirements.split('\n').map((line, index) => (
                          <div key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">•</span>
                            <span>{line.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <div className="flex items-center mb-4">
                  <StarIcon className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="text-xl font-semibold text-green-600">
                    Requisitos
                  </h3>
                </div>
                <div className="space-y-4">
                  {jobPosition.experience_level && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Educación:</h4>
                      <p className="text-gray-700">
                        {jobPosition.experience_level === 'SENIOR' ? 'Título universitario completo' : 
                         jobPosition.experience_level === 'MID' ? 'Título universitario en curso o completo' : 
                         'Estudios universitarios en curso'}
                      </p>
                    </div>
                  )}
                  
                  {jobPosition.experience_level && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Experiencia:</h4>
                      <p className="text-gray-700">
                        {jobPosition.experience_level === 'SENIOR' ? 'Mínimo 5 años de experiencia en el área' : 
                         jobPosition.experience_level === 'MID' ? '2-4 años de experiencia en el área' : 
                         'Sin experiencia previa requerida'}
                      </p>
                    </div>
                  )}

                  {jobPosition.english_level && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Inglés:</h4>
                      <p className="text-gray-700">
                        {jobPosition.english_level === 'NATIVE' ? 'Nativo' :
                         jobPosition.english_level === 'ADVANCED' ? 'Avanzado' :
                         jobPosition.english_level === 'INTERMEDIATE' ? 'Intermedio' :
                         jobPosition.english_level === 'BASIC' ? 'Básico' :
                         'No requerido'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Information - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Nosotros
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>
                  La Universidad Austral es una institución de educación superior comprometida con la excelencia académica y la formación integral de sus estudiantes.
                </p>
                <p>
                  Nuestra misión es formar profesionales competentes, éticos y comprometidos con el desarrollo de la sociedad, a través de una educación de calidad que combine la teoría con la práctica.
                </p>
                <p>
                  Valoramos la innovación, la responsabilidad social y el compromiso con la excelencia en todo lo que hacemos.
                </p>
                <p>
                  Como empleador, ofrecemos un ambiente de trabajo dinámico y colaborativo, donde cada miembro del equipo puede desarrollar su potencial y contribuir al crecimiento de la organización.
                </p>
                <p>
                  Creemos en la diversidad, la inclusión y el respeto mutuo como pilares fundamentales de nuestra cultura organizacional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de aplicación */}
      <ApplyConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmApply}
        isLoading={isApplying}
      />

      {/* Notificaciones Toast */}
      {showToast && (
        <ToastNotification
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default JobPosition;
