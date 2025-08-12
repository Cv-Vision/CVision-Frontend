import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, ChartBarIcon, UserGroupIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { useGetCandidatesByJobId } from '@/hooks/useGetCandidatesByJobId';
import { useGetAnalysisResults } from '@/hooks/useGetAnalysisResults';
import { useDeleteAnalysisResults } from '@/hooks/useDeleteAnalysisResults';
import DeleteConfirmationModal from '@/components/other/DeleteConfirmationModal.tsx';
import Toast from '@/components/other/Toast.tsx';
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
  const getScoreColorClass = (score: number) => {
    if (score >= 70) return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    if (score >= 40) return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
    return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
      isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start space-x-4 flex-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(cvId, e.target.checked)}
              className={`mt-1 h-6 w-6 text-blue-600 focus:ring-blue-500 border-2 rounded transition-all duration-200 ${
                isSelected 
                  ? 'border-blue-600 bg-blue-600 shadow-lg' 
                  : 'border-gray-300 hover:border-blue-400'
              }`}
          />
          <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {result.name || result.cv_name || result.participant_id}
            </h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Analizado el {formatDate(result.created_at || result.timestamp)}</span>
                </div>
            {result.position && (
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <span>Puesto: <span className="font-semibold text-gray-800">{result.position}</span></span>
                  </div>
            )}
              </div>
          </div>
        </div>
        <div className="flex items-center">
            <div className={`text-3xl font-bold px-6 py-3 rounded-xl shadow-lg ${getScoreColorClass(result.score)}`}>
            {result.score}%
          </div>
        </div>
      </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <ChartBarIcon className="h-5 w-5 text-blue-600 mr-2" />
              Razones del puntaje
            </h4>
            <ul className="space-y-2">
          {result.reasons.map((reason, idx) => (
                <li key={idx} className="text-gray-700 flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{reason}</span>
                </li>
          ))}
        </ul>
      </div>

      {Array.isArray(result.soft_skills_reasons) && result.soft_skills_reasons.length > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <UserGroupIcon className="h-5 w-5 text-green-600 mr-2" />
                Razones de habilidades blandas
              </h4>
              <ul className="space-y-2">
            {result.soft_skills_reasons.map((reason, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{reason}</span>
                  </li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(result.soft_skills_questions) && result.soft_skills_questions.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <TrophyIcon className="h-5 w-5 text-purple-600 mr-2" />
                Preguntas sugeridas para entrevista
              </h4>
              <ul className="space-y-2">
            {result.soft_skills_questions?.map((question, idx) => (
                  <li key={idx} className="text-gray-700 flex items-start">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>{question}</span>
                  </li>
            ))}
          </ul>
        </div>
      )}
        </div>
      </div>
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
    console.log('🗑️ IDs seleccionados para eliminar:', cvIdsArray);
    console.log('📋 Candidatos disponibles:', candidates.map(c => ({ id: c.id, name: c.fullName })));
    console.log('📊 Resultados disponibles:', results.map(r => ({ name: r.name || r.cv_name || r.participant_id, cv_id: r.cv_id, participant_id: r.participant_id })));
    
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium text-lg">Cargando resultados de análisis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar resultados</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const total = results.length;
  const avg = total > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / total) : 0;
  const maxResult = total > 0 ? results[0] : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 font-medium mb-6 group"
        >
          <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Volver</span>
      </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Resultados de Análisis de CVs</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total de CVs</p>
                  <p className="text-3xl font-bold">{total}</p>
                </div>
                <UserGroupIcon className="h-12 w-12 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Promedio</p>
                  <p className="text-3xl font-bold">{total > 0 ? avg + '%' : 'N/A'}</p>
                </div>
                <ChartBarIcon className="h-12 w-12 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Mejor Score</p>
                  <p className="text-3xl font-bold">{maxResult ? maxResult.score + '%' : 'N/A'}</p>
                </div>
                <TrophyIcon className="h-12 w-12 text-yellow-200" />
              </div>
            </div>
          </div>
        </div>
        
        {results.length > 0 && (
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-6">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={areAllSelected()}
                onChange={handleSelectAll}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
              />
              <span className="font-semibold text-gray-800">
                {selectedCvIds.size > 0 ? `${selectedCvIds.size} seleccionado${selectedCvIds.size > 1 ? 's' : ''}` : 'Seleccionar todos'}
              </span>
            </div>
            
            {selectedCvIds.size > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Eliminar</span>
              </button>
            )}
          </div>
        )}

        <div className="space-y-6">
          {results.map((result, idx) => {
            // Buscar el candidato correspondiente por nombre
            const correspondingCandidate = candidates.find(candidate => 
              candidate.fullName === (result.name || result.cv_name || result.participant_id)
            );
            
            // Usar el ID del candidato si existe, sino el ID del resultado
            const uniqueId = correspondingCandidate?.id || result.cv_id || result.participant_id || `index_${idx}`;
            
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
    </div>
  );
}
