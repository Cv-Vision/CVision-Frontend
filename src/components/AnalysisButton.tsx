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
  extraRequirements
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysis = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('idToken'); // Obtener el token del sessionStorage
      
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
      }

      const payload: Record<string, any> = { job_id: jobId };
      if (extraRequirements) {
        payload.extra_requirements = extraRequirements;
        console.log('Extra requirements:', extraRequirements);
      }
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
        onSuccess?.();
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
  );
};

export default AnalysisButton; 