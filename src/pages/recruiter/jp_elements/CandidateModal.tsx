import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { GeminiAnalysisResult } from '@/services/geminiAnalysisService';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidate: {
    fullName: string;
    score: number | null;
  } | null;
  analysisResults: GeminiAnalysisResult[];
}

// Función para determinar el color del puntaje basado en el score
const getScoreColorClass = (score: number | null) => {
  if (score === null || score === undefined) return 'bg-gray-400 text-white';
  if (score >= 70) return 'bg-green-500 text-white';
  if (score >= 40) return 'bg-yellow-500 text-white';
  return 'bg-red-500 text-white';
};

const CandidateModal = ({
                          isOpen,
                          onClose,
                          selectedCandidate,
                          analysisResults,
                        }: CandidateModalProps) => {
  if (!selectedCandidate) return null;

  const selectedAnalysis = analysisResults.find(
    (result) =>
      result.name?.toLowerCase().trim() ===
      selectedCandidate.fullName.toLowerCase().trim()
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto z-50">

          {/* Botón cerrar visible arriba a la derecha del modal */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          {/* Cabecera con nombre y puntaje centrado */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{selectedCandidate.fullName}</h2>
            <div className="flex flex-col items-center mr-6"> {/* agregado margen */}
              <div className={`rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-md ${getScoreColorClass(selectedCandidate.score)}`}>
                {selectedCandidate.score !== null && selectedCandidate.score !== undefined ? selectedCandidate.score : 'N/A'}
              </div>
              <span className="text-lg text-gray-600 mt-2">Puntaje</span>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <p className="font-semibold text-xl text-blue-600 mb-4">Observaciones:</p>
            {selectedAnalysis?.reasons && selectedAnalysis.reasons.length > 0 ? (
              <ul className="list-disc list-inside text-lg text-gray-700 space-y-2">
                {selectedAnalysis.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p className="text-lg text-gray-500">Sin observaciones disponibles.</p>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CandidateModal;
