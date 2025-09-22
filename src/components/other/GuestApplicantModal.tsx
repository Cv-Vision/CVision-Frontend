import React, { useEffect, useState } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ApplicantCVDropzone from '@/components/applicant/ApplicantCVDropzone';
import { useGuestApplication } from '@/hooks/useGuestApplication';
import { useToast } from '../../context/ToastContext';

interface GuestApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  onApply: (applicationData: GuestApplicationData) => void;
}

export interface GuestApplicationData {
  name: string;
  email: string;
  jobId: string;
  cvData: {
    cvUrl: string;
    fileName: string;
    fileSize: number;
    [key: string]: any;
  };
}

const GuestApplicantModal: React.FC<GuestApplicantModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  onApply
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [cvData, setCvData] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { applyAsGuest, isLoading, error, clearError } = useGuestApplication();
  const { showToast } = useToast();

  // Mostrar errores del backend como toast (traducidos) y limpiar estado local
  useEffect(() => {
    if (!error) return;
    const msg = typeof error === 'string' ? error : String(error);
    const normalized = msg.toLowerCase();
    let friendly = msg;
    
    // Manejar específicamente el error de email ya registrado
    if (msg === 'EMAIL_ALREADY_REGISTERED') {
      friendly = 'Este email ya está registrado en nuestra plataforma. Por favor, inicia sesión para aplicar a este trabajo.';
    } else if (normalized.includes('already') && normalized.includes('appl')) {
      friendly = 'Ya te has postulado a este trabajo.';
    }
    
    showToast(friendly, 'error');
    clearError();
  }, [error, showToast, clearError]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    // Validar CV
    if (!cvData || !cvData.cvUrl) {
      newErrors.cv = 'Debes subir tu CV para aplicar';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCVProcessed = (cvInfo: any) => {
    setCvData(cvInfo);
    // Limpiar error de CV si existe
    if (errors.cv) {
      setErrors(prev => ({
        ...prev,
        cv: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    clearError();
    
    try {
      const applicationData: GuestApplicationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        jobId,
        cvData
      };

      // Call the real hook instead of the mock
      await applyAsGuest(applicationData);
      
      // Call the parent callback with the result
      onApply(applicationData);
      
      // Mostrar mensaje de éxito
      setShowSuccess(true);
      
      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        setFormData({ name: '', email: '' });
        setCvData(null);
        setErrors({});
        setShowSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error al enviar aplicación:', error);
      const msg = error instanceof Error ? error.message : 'Error al enviar la aplicación. Inténtalo de nuevo.';
      const normalized = msg.toLowerCase();
      let friendly = msg;
      
      // Manejar específicamente el error de email ya registrado
      if (msg === 'EMAIL_ALREADY_REGISTERED') {
        friendly = 'Este email ya está registrado en nuestra plataforma. Por favor, inicia sesión para aplicar a este trabajo.';
      } else if (normalized.includes('already') && normalized.includes('appl')) {
        friendly = 'Ya te has postulado a este trabajo.';
      }
      
      showToast(friendly, 'error');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', email: '' });
      setCvData(null);
      setErrors({});
      setShowSuccess(false);
      clearError();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Aplicar como invitado</h2>
            <p className="text-gray-600 mt-1">Aplicando a: <span className="font-semibold text-blue-600">{jobTitle}</span></p>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {showSuccess ? (
            // Success Message
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Aplicación enviada exitosamente!</h3>
              <p className="text-gray-600">
                Tu aplicación ha sido enviada. Te contactaremos pronto.
              </p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información personal */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Información personal</h3>
                
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa tu nombre completo"
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="tu@email.com"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* CV Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">CV</h3>
                <div className={errors.cv ? 'border-2 border-red-300 rounded-xl p-1' : ''}>
                  <ApplicantCVDropzone onCVProcessed={handleCVProcessed} />
                </div>
                {errors.cv && (
                  <p className="text-sm text-red-600">{errors.cv}</p>
                )}
                
                {/* File limits info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">Límites de archivo:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Solo archivos PDF</li>
                    <li>• Tamaño máximo: 5MB</li>
                    <li>• El archivo será procesado automáticamente</li>
                  </ul>
                </div>
              </div>

              {/* Errores de envío ahora se muestran con toasts centrados */}

              {/* Submit button */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !cvData?.cvUrl}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </div>
                  ) : (
                    'Enviar aplicación'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestApplicantModal;
