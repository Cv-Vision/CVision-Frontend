import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { GeminiAnalysisResult } from '@/services/geminiAnalysisService';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidate: {
    fullName: string;
    score: number;
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

  const selectedAnalysis = analysisResults.find((result) =>
    result.name?.toLowerCase().trim() === selectedCandidate.fullName.toLowerCase().trim()
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30" />
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl z-50">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-[1fr_auto] items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">{selectedCandidate.fullName}</h2>
          <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-xl font-bold">
            {selectedCandidate.score}
          </div>
        </div>

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
      </div>
    </Dialog>
  );
};

export default CandidateModal;
