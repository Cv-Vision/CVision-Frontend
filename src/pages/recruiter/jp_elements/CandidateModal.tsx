import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { GeminiAnalysisResult } from '@/services/geminiAnalysisService';
import { useGetCVDownloadUrl } from '@/hooks/useGetCVDownloadUrl';
import { useParams } from 'react-router-dom';


interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidate: {
    fullName: string;
    score: number | null;
    cvId: string;
  } | null;
  analysisResults: GeminiAnalysisResult[];
}

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
  const { jobId } = useParams<{ jobId: string }>();

  const {
    data,
    isLoading,
    error,
  } = useGetCVDownloadUrl(
    jobId ?? '',
    selectedCandidate?.cvId ?? '',
    !!selectedCandidate?.cvId && isOpen
  );

  console.log('CV URL data:', data);
  console.log("Selected candidate:", selectedCandidate);

  const selectedAnalysis = selectedCandidate
    ? analysisResults.find(
      (result) =>
        result.name?.toLowerCase().trim() ===
        selectedCandidate.fullName.toLowerCase().trim()
    )
    : null;

  if (!selectedCandidate) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto z-50">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-8 w-8" />
          </button>

          {/* Cabecera */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{selectedCandidate.fullName}</h2>
            <div className="flex flex-col items-center mr-6">
              <div
                className={`rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-md ${getScoreColorClass(
                  selectedCandidate.score
                )}`}
              >
                {selectedCandidate.score ?? 'N/A'}
              </div>
              <span className="text-lg text-gray-600 mt-2">Puntaje</span>
            </div>
          </div>

          {/* Visualización del CV */}
          <div className="w-full mb-6">
            {isLoading ? (
              <p className="text-sm text-gray-500 mb-2">Cargando CV...</p>
            ) : error ? (
              <p className="text-sm text-red-500 mb-2">No se pudo cargar el CV.</p>
            ) : data?.url ? (
              <>
                <p className="text-sm text-blue-600 mb-2 font-medium">CV Original:</p>
                <a
                  href={data.url}
                  download={data.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-blue-700 underline hover:text-blue-900 mb-4"
                >
                  Descargar CV
                </a>

                {(() => {
                  const baseUrl = data.url.split('?')[0];
                  if (baseUrl.endsWith('.pdf')) {
                    return (
                      <iframe
                        src={data.url}
                        title="CV PDF"
                        className="w-full h-[600px] border border-gray-300 rounded-md"
                      />
                    );
                  } else if (baseUrl.match(/\.(png|jpg|jpeg)$/i)) {
                    return (
                      <img
                        src={data.url}
                        alt="CV Imagen"
                        className="max-w-full max-h-[600px] border border-gray-300 rounded-md"
                      />
                    );
                  } else {
                    return <p className="text-sm text-gray-500">Formato de archivo no soportado.</p>;
                  }
                })()}
              </>
            ) : null}
          </div>

          {/* Observaciones */}
          <div>
            <p className="font-semibold text-xl text-blue-600 mb-4">Observaciones:</p>
            {selectedAnalysis?.reasons?.length ? (
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
