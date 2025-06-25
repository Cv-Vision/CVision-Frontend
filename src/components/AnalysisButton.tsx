import React, { useState } from 'react';
import axios from 'axios';
import type { ExtraRequirements } from '@/components/ExtraRequirementsForm';

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
        'https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/call_cv_batch_invoker',
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
          px-4 py-2 rounded-md text-white font-medium
          ${isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }
          transition-colors duration-200
          flex items-center justify-center
          min-w-[120px]
        `}
      >
        {isLoading ? (
          <>
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Procesando...
          </>
        ) : (
          'Analizar CVs'
        )}
      </button>
      
      {showSuccess && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="flex items-center justify-center text-green-800">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">
              Los CVs han sido exitosamente enviados a analizar. Por favor espere unos minutos.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisButton; 