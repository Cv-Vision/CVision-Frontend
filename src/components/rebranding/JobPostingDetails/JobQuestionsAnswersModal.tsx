import React, { useState } from 'react';
import { X, User, MessageSquare, Clock } from 'lucide-react';
import { useGetJobQuestionsWithAnswers } from '@/hooks/useGetJobQuestionsWithAnswers';

interface JobQuestionsAnswersModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
}

const JobQuestionsAnswersModal: React.FC<JobQuestionsAnswersModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
}) => {
  const { data, isLoading, error } = useGetJobQuestionsWithAnswers(jobId);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedCandidate = data?.candidates_with_answers.find(
    c => c.candidate_id === selectedCandidateId
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Preguntas y Respuestas
            </h2>
            {jobTitle && (
              <p className="text-sm text-gray-600 mt-1">{jobTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {isLoading && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 text-blue-600">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Cargando preguntas y respuestas...</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-red-600">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">Error al cargar los datos</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {data && (
            <>
              {/* Left Panel - Questions and Candidates List */}
              <div className="w-1/2 border-r flex flex-col">
                {/* Questions Section */}
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Preguntas del Puesto ({data.questions?.length || 0})
                  </h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {data.questions?.length > 0 ? (
                      data.questions.map((question: any, index: number) => {
                        const questionText = question.question_text || question.text || question.question || question.title || 'Pregunta sin texto';
                        return (
                          <div key={question.id} className="bg-white p-3 rounded-lg border text-sm">
                            <span className="font-medium text-blue-600">#{index + 1}</span>
                            <p className="text-gray-700 mt-1">{questionText}</p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-500 text-sm py-4">
                        <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-50" />
                        <p>No hay preguntas configuradas para este puesto</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Candidates Section */}
                <div className="flex-1 overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Candidatos con Respuestas ({data.candidates_with_answers?.length || 0})
                    </h3>
                  </div>
                  <div className="overflow-y-auto h-full">
                    {!data.candidates_with_answers?.length ? (
                      <div className="p-4 text-center text-gray-500">
                        <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No hay candidatos con respuestas aún</p>
                      </div>
                    ) : (
                      <div className="p-2">
                        {data.candidates_with_answers.map((candidate: any) => (
                          <button
                            key={candidate.candidate_id}
                            onClick={() => setSelectedCandidateId(candidate.candidate_id)}
                            className={`w-full p-3 mb-2 text-left rounded-lg border transition-colors ${
                              selectedCandidateId === candidate.candidate_id
                                ? 'bg-blue-50 border-blue-200 text-blue-900'
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div className="font-medium text-sm">{candidate.candidate_name}</div>
                            <div className="text-xs text-gray-600 mt-1">{candidate.candidate_email}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {candidate.answers?.length || 0} respuesta{(candidate.answers?.length || 0) !== 1 ? 's' : ''}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Panel - Selected Candidate Answers */}
              <div className="w-1/2 flex flex-col">
                {selectedCandidate ? (
                  <>
                    <div className="p-4 bg-blue-50 border-b">
                      <h3 className="font-medium text-blue-900">Respuestas de {selectedCandidate.candidate_name}</h3>
                      <p className="text-sm text-blue-700 mt-1">{selectedCandidate.candidate_email}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {data.questions?.length > 0 ? (
                        data.questions.map((question: any, index: number) => {
                          const answer = selectedCandidate.answers?.find(
                            (a: any) => a.question_id === question.id
                          );
                          const questionText = question.question_text || question.text || question.question || 'Pregunta sin texto';
                          
                          return (
                            <div key={question.id} className="border rounded-lg p-4 bg-white">
                              <div className="mb-3">
                                <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                  Pregunta #{index + 1}
                                </span>
                                <p className="font-medium text-gray-900 mt-2">{questionText}</p>
                              </div>
                              
                              <div className="border-t pt-3">
                                {answer ? (
                                  <>
                                    <p className="text-gray-700 text-sm mb-2">{answer.answer_text}</p>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                      <Clock className="w-3 h-3" />
                                      <span>Respondido el {formatDate(answer.created_at)}</span>
                                    </div>
                                  </>
                                ) : (
                                  <p className="text-gray-400 text-sm italic">Sin respuesta</p>
                                )}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center text-gray-500 py-8">
                          <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No hay preguntas para mostrar</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p className="font-medium">Selecciona un candidato</p>
                      <p className="text-sm mt-1">para ver sus respuestas</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobQuestionsAnswersModal;