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
        <Dialog.Panel className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl z-50">

          {/* Botón cerrar visible arriba a la derecha del modal */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Cabecera con nombre y puntaje centrado */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{selectedCandidate.fullName}</h2>
            <div className="flex flex-col items-center mr-4"> {/* agregado margen */}
              <div className={`rounded-full w-14 h-14 flex items-center justify-center text-xl font-bold shadow-md ${
                selectedCandidate.score !== null && selectedCandidate.score !== undefined 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-400 text-white'
              }`}>
                {selectedCandidate.score !== null && selectedCandidate.score !== undefined ? selectedCandidate.score : 'N/A'}
              </div>
              <span className="text-sm text-gray-600 mt-1">Puntaje</span>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <p className="font-semibold text-sm text-blue-600 mb-2">Observaciones:</p>
            {selectedAnalysis?.reasons && selectedAnalysis.reasons.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                {selectedAnalysis.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Sin observaciones disponibles.</p>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CandidateModal;
