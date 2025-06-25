import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useGetCandidatesByJobId } from '@/hooks/useGetCandidatesByJobId';
import { useGetAnalysisResults } from '@/hooks/useGetAnalysisResults';
import { useDeleteAnalysisResults } from '@/hooks/useDeleteAnalysisResults';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Toast from '@/components/Toast';
import { GeminiAnalysisResult } from '@/services/geminiAnalysisService';

// Extiendo el tipo para soportar created_at
interface GeminiAnalysisResultWithCreatedAt extends GeminiAnalysisResult {
  created_at?: string;
}

function formatDate(dateString?: string) {
  if (!dateString) return '-';
  // Elimina microsegundos si existen (mantén solo hasta los milisegundos)
  const clean = dateString.replace(/\.(\d{3})\d*$/, '.$1');
  const date = new Date(clean);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString();
}

const CVAnalysisResultCard = ({ 
  result, 
  isSelected, 
  onSelect,
  cvId
}: { 
  result: GeminiAnalysisResultWithCreatedAt;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  cvId: string;
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(cvId, e.target.checked)}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">
              {result.name || result.cv_name || result.participant_id}
            </h3>
            <p className="text-sm text-gray-500">
              Analizado el {formatDate(result.created_at || result.timestamp)}
            </p>
            {result.position && (
              <p className="text-sm text-gray-500">Puesto: <span className="font-semibold">{result.position}</span></p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-2xl font-bold text-blue-600">
            {result.score}%
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Razones</h4>
        <ul className="list-disc list-inside space-y-2">
          {result.reasons.map((reason, idx) => (
            <li key={idx} className="text-gray-700">{reason}</li>
          ))}
        </ul>
      </div>

      {Array.isArray(result.soft_skills_reasons) && result.soft_skills_reasons.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Razones de habilidades blandas</h4>
          <ul className="list-disc list-inside space-y-2">
            {result.soft_skills_reasons.map((reason, idx) => (
              <li key={idx} className="text-gray-700">{reason}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(result.soft_skills_questions) && result.soft_skills_questions.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Preguntas sugeridas para entrevista</h4>
          <ul className="list-disc list-inside space-y-2">
            {result.soft_skills_questions?.map((question, idx) => (
              <li key={idx} className="text-gray-700">{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function CVAnalysisResults() {
  const { jobId } = useParams<{ jobId: string }>();
  const [selectedCvIds, setSelectedCvIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  const { deleteResults, isLoading: isDeleting, error: deleteError, success: deleteSuccess, resetState } = useDeleteAnalysisResults();
  const { candidates } = useGetCandidatesByJobId(jobId || '');
  const { results, isLoading, error } = useGetAnalysisResults(jobId || '');

  // Manejar éxito/error de eliminación
  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage('Análisis eliminado exitosamente');
      setToastType('success');
      setShowToast(true);
      setSelectedCvIds(new Set());
      resetState();
      
      // Redirigir al job posting después de un breve delay para mostrar el toast
      setTimeout(() => {
        navigate(`/recruiter/job/${jobId}`);
      }, 1500);
    }
  }, [deleteSuccess, jobId, resetState, navigate]);

  useEffect(() => {
    if (deleteError) {
      setToastMessage(deleteError);
      setToastType('error');
      setShowToast(true);
      resetState();
    }
  }, [deleteError, resetState]);

  const handleSelectCv = (cvId: string, selected: boolean) => {
    const newSelected = new Set(selectedCvIds);
    if (selected) {
      newSelected.add(cvId);
    } else {
      newSelected.delete(cvId);
    }
    setSelectedCvIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCvIds.size === results.length) {
      setSelectedCvIds(new Set());
    } else {
      // Usar los cv_id reales de los candidatos
      const allCvIds = candidates.map(candidate => candidate.id).filter(Boolean);
      setSelectedCvIds(new Set(allCvIds));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedCvIds.size === 0) return;
    
    const cvIdsArray = Array.from(selectedCvIds);
    await deleteResults(jobId!, cvIdsArray);
    setShowDeleteModal(false);
  };

  // Función para verificar si todos están seleccionados
  const areAllSelected = () => {
    if (results.length === 0) return false;
    const allCvIds = candidates.map(candidate => candidate.id).filter(Boolean);
    return allCvIds.length > 0 && allCvIds.every(id => selectedCvIds.has(id));
  };

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  const total = results.length;
  const avg = total > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / total) : 0;
  const maxResult = total > 0 ? results[0] : undefined;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        <span>Volver</span>
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resultados de Análisis de CVs</h1>
        
        {results.length > 0 && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={areAllSelected()}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">
                Seleccionar todos ({selectedCvIds.size} de {results.length})
              </span>
            </div>
            
            {selectedCvIds.size > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Eliminar seleccionado{selectedCvIds.size !== 1 ? 's' : ''} ({selectedCvIds.size})</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6 flex flex-wrap gap-8 justify-start">
        <div className="text-lg font-semibold text-gray-800">
          Total de CVs analizados: <span className="font-bold">{total}</span>
        </div>
        <div className="text-lg font-semibold text-gray-800">
          Promedio de score: <span className="font-bold">{total > 0 ? avg + '%' : 'N/A'}</span>
        </div>
        <div className="text-lg font-semibold text-gray-800">
          Score más alto: <span className="font-bold">{maxResult ? maxResult.score + '%' : 'N/A'}</span>
        </div>
      </div>

      <div className="grid gap-6">
        {results.map((result, idx) => {
          const uniqueId = result.cv_id || result.participant_id || `index_${idx}`;
          return (
            <CVAnalysisResultCard 
              key={idx} 
              result={result} 
              isSelected={selectedCvIds.has(uniqueId)}
              onSelect={handleSelectCv}
              cvId={uniqueId}
            />
          );
        })}
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSelected}
        selectedCount={selectedCvIds.size}
        isLoading={isDeleting}
      />

      <Toast
        type={toastType}
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
