import React, { useState } from 'react';
import axios from 'axios';
import type { ExtraRequirements } from '@/components/other/ExtraRequirementsForm.tsx';
import { MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface AnalysisButtonProps {
  jobId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  extraRequirements?: ExtraRequirements;
}

const AnalysisButton: React.FC<AnalysisButtonProps> = ({ 
  jobId, 
  onSuccess, 
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAnalysis = async () => {
    try {
      setIsLoading(true);
      setShowSuccess(false);
      const token = sessionStorage.getItem('idToken'); // Obtener el token del sessionStorage
      
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
      }

      const payload: Record<string, any> = { job_id: jobId };
      // Ya no se envían requisitos adicionales
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/recruiter/call-cv-batch-invoker`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.status === 200) {
        setShowSuccess(true);
        onSuccess?.();
        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        throw new Error('Error al iniciar el análisis');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleAnalysis}
        disabled={isLoading}
        className={`
          w-full px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2
          ${isLoading 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Procesando...</span>
          </>
        ) : (
          <>
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span>Analizar CVs</span>
          </>
        )}
      </button>
      
      {showSuccess && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl text-center animate-fade-in-out">
          <div className="flex items-center justify-center text-green-800">
            <CheckCircleIcon className="w-6 h-6 mr-3 text-green-600" />
            <div className="text-left">
              <p className="text-sm font-semibold text-green-800">¡Análisis iniciado!</p>
              <p className="text-xs text-green-600 mt-1">
                Los CVs han sido enviados a analizar. Por favor espere unos minutos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisButton; 