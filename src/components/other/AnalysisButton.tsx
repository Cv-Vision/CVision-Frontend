import React, { useState } from 'react';
import axios from 'axios';
import type { ExtraRequirements } from '@/components/other/ExtraRequirementsForm.tsx';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CONFIG } from '@/config';
import { useToast } from '../../context/ToastContext';

interface AnalysisButtonProps {
  jobId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  extraRequirements?: any;
}

const AnalysisButton: React.FC<AnalysisButtonProps> = ({ 
  jobId, 
  onSuccess, 
  onError,
  extraRequirements,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleAnalysis = async () => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem('idToken'); // Obtener el token del sessionStorage
      
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
      }

      const payload: Record<string, any> = { job_id: jobId };
      if (extraRequirements && extraRequirements.additional_requirements) {
        payload.additional_requirements = extraRequirements.additional_requirements;
      }
      
      const response = await axios.post(
        `${CONFIG.apiUrl}/cv/analyze-job-cvs`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      if (response.status === 200) {
        showToast(response.data.message, 'success');
        onSuccess?.();
      } else {
        throw new Error('Error al iniciar el análisis');
      }
    } catch (error) {
      let errorMessage = 'Error desconocido';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      // Customize the error message
      if (errorMessage.includes("No CVs found for job_id")) {
        errorMessage = "CVs no encontrados para este puesto";
      }

      showToast(errorMessage, 'error');
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
    </div>
  );
};

export default AnalysisButton; 