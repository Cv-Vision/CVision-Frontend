import { useState } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth.ts';

interface ProcessCVsButtonProps {
  jobId: string;
  apiUrl: string;
}

export const ProcessCVsButton = ({ jobId, apiUrl }: ProcessCVsButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleProcessCVs = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetchWithAuth(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_id: jobId }),
      });

      if (response.ok) {
        setMessage('✅ Todos los CVs han sido enviados a procesamiento.');
      } else {
        const errorText = await response.text();
        throw new Error(errorText || `Error: ${response.status}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error al procesar los CVs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleProcessCVs}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Procesando...' : 'Procesar todos los CVs'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};
