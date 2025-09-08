import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';
import { useGetJobQuestions, JobQuestion } from '@/hooks/useGetJobQuestions';

interface JobQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
}

interface QuestionAnswer {
  questionId: string;
  answer: string;
}

const JobQuestionsModal = ({ isOpen, onClose, jobId, jobTitle }: JobQuestionsModalProps) => {
  const [currentTab, setCurrentTab] = useState<'intro' | 'questions'>('intro');
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const { questions, isLoading, error, fetchQuestions } = useGetJobQuestions();

  // Reset modal state when it opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentTab('intro');
      setHasConfirmed(false);
      setAnswers([]);
    }
  }, [isOpen]);


  const handleProceedToQuestions = () => {
    setHasConfirmed(true);
    setCurrentTab('questions');
    fetchQuestions(jobId);
  };

  const handleSkip = () => onClose();

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => (a.questionId === questionId ? { ...a, answer } : a));
      }
      return [...prev, { questionId, answer }];
    });
  };

  const handleSubmit = async () => {
    console.log('Respuestas enviadas:', answers);
    onClose();
  };

  const handleGoBack = () => {
    setCurrentTab('intro');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header dinámico (igual que tu versión anterior) */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Botón de volver sólo visible en la segunda pestaña */}
              {currentTab === 'questions' && hasConfirmed && (
                <button
                  onClick={handleGoBack}
                  className="mr-3 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <ChevronLeftIcon className="h-6 w-6" />
                </button>
              )}

              {currentTab === 'intro' ? (
                <QuestionMarkCircleIcon className="h-8 w-8 mr-3" />
              ) : (
                <DocumentTextIcon className="h-8 w-8 mr-3" />
              )}

              <div>
                <h2 className="text-xl font-bold">
                  {currentTab === 'intro' ? 'Preguntas adicionales' : 'Responde las preguntas'}
                </h2>
                {jobTitle && <p className="text-blue-100 text-sm mt-1">{jobTitle}</p>}
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Indicador de progreso */}
          <div className="flex items-center mt-4 space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentTab === 'intro' ? 'bg-white' : 'bg-white/50'}`}></div>
            <div className={`h-0.5 w-8 ${hasConfirmed ? 'bg-white' : 'bg-white/30'}`}></div>
            <div className={`w-3 h-3 rounded-full ${currentTab === 'questions' && hasConfirmed ? 'bg-white' : 'bg-white/30'}`}></div>
          </div>
        </div>

        {/* Contenido con transición */}
        <div className="relative overflow-hidden" style={{ height: 'calc(90vh - 140px)' }}>
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{

              transform: currentTab === 'intro' ? 'translateX(0%)' : 'translateX(-50%)',
              width: '200%'
            }}
          >
            {/* Pestaña 1: Introducción (estilo original) */}
            <div className="w-1/2 flex-shrink-0 overflow-y-auto">
              <IntroTab onProceed={handleProceedToQuestions} onSkip={handleSkip} />
            </div>

            {/* Pestaña 2: Preguntas */}
            <div className="w-1/2 flex-shrink-0 overflow-y-auto">
              {hasConfirmed && (
                <QuestionsTab
                  questions={questions}
                  answers={answers}
                  isLoading={isLoading}
                  error={error}
                  onAnswerChange={handleAnswerChange}
                  onSubmit={handleSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pestaña de introducción
const IntroTab = ({ onProceed, onSkip }: { onProceed: () => void; onSkip: () => void }) => {
  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <QuestionMarkCircleIcon className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">¡Ayúdanos a conocerte mejor!</h3>
        <p className="text-gray-600 leading-relaxed text-lg">
          El reclutador ha preparado algunas preguntas adicionales que lo ayudarán a conocer
          más sobre tu perfil y experiencia.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-white text-sm font-bold">💡</span>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">¿Por qué es importante?</h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Ayuda al reclutador a conocer mejor tu perfil</li>
              <li>• Puede mejorar tus posibilidades de ser seleccionado</li>
              <li>• Todas las preguntas son completamente opcionales</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onSkip}
          className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-medium transition-all duration-300 shadow-md hover:shadow-lg"
        >
          No, omitir
        </button>
        <button
          onClick={onProceed}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          ¡Sí, responder!
        </button>
      </div>
    </div>
  );
};

// Pestaña de preguntas
const QuestionsTab = ({
                        questions,
                        answers,
                        isLoading,
                        error,
                        onAnswerChange,
                        onSubmit
                      }: {
  questions: JobQuestion[];
  answers: QuestionAnswer[];
  isLoading: boolean;
  error: string | null;
  onAnswerChange: (questionId: string, answer: string) => void;
  onSubmit: () => void;
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Cargando preguntas...</h3>
        <p className="text-gray-500">Por favor espera un momento</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DocumentTextIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin preguntas adicionales</h3>
        <p className="text-gray-500">No hay preguntas adicionales para esta posición.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/*Header*/}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-amber-600">ℹ️</span>
          <p className="text-amber-800 text-sm font-medium">
            Recuerda: <strong>Todas las preguntas son opcionales.</strong> Responde solo las que consideres relevantes.
          </p>
        </div>
      </div>

      {/* Lista de preguntas */}
      <div className="space-y-6 mb-8">
        {questions.map((question, index) => {
          const currentAnswer = answers.find(a => a.questionId === question.id)?.answer || '';

          return (
            <div
              key={question.id}
              className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors"
            >
              <div className="mb-4">
                <label className="block text-gray-800 font-semibold mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-sm font-bold rounded-full mr-3">
                    {index + 1}
                  </span>
                  {question.question}
                </label>
              </div>

              {question.questionType === 'OPEN' && (
                <textarea
                  value={currentAnswer}
                  onChange={(e) => onAnswerChange(question.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  rows={4}
                />
              )}

              {question.questionType === 'YES_NO' && (
                <div className="flex gap-6">
                  {['Sí', 'No'].map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={currentAnswer === option}
                        onChange={(e) => onAnswerChange(question.id, e.target.value)}
                        className="mr-3 w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.questionType === 'NUMERICAL' && (
                <input
                  type="number"
                  value={currentAnswer}
                  onChange={(e) => onAnswerChange(question.id, e.target.value)}
                  placeholder="Ingresa un número..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Botón de envío */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={onSubmit}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Enviar respuestas
        </button>
      </div>
    </div>
  );
};

export default JobQuestionsModal;
