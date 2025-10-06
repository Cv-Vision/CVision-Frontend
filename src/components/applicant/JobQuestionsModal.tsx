import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useGetJobQuestions, JobQuestion } from '@/hooks/useGetJobQuestions';
import { useSubmitQuestionAnswers } from '@/hooks/useSubmitQuestionAnswers';
import { useToast } from '@/context/ToastContext';

interface JobQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
  showGuestRegisterMessage?: boolean;
}

interface QuestionAnswer {
  questionId: string;
  answer: string | null;
}

const JobQuestionsModal = ({ isOpen, onClose, jobId, showGuestRegisterMessage = false }: JobQuestionsModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const { questions, isLoading, error, fetchQuestions } = useGetJobQuestions();
  const { submitAnswers, isLoading: isSubmitting } = useSubmitQuestionAnswers();
  const { showToast } = useToast();


  useEffect(() => {
    if (isOpen && !showGuestRegisterMessage) {
      setCurrentStep(1);
      setHasConfirmed(false);
      setAnswers([]);
      fetchQuestions(jobId);
    }
  }, [isOpen, jobId, fetchQuestions, showGuestRegisterMessage]);


  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => onClose();

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      const normalizedAnswer = answer.trim() === '' ? null : answer;
      
      if (existing) {
        return prev.map(a => (a.questionId === questionId ? { ...a, answer: normalizedAnswer } : a));
      }
      return [...prev, { questionId, answer: normalizedAnswer }];
    });
  };

  const handleSubmit = async () => {
    try {

      const allAnswers = questions.map(question => {
        const existingAnswer = answers.find(a => a.questionId === question.id);
        return {
          questionId: question.id,
          answer: existingAnswer?.answer || null
        };
      });

      await submitAnswers(jobId, allAnswers);
      showToast('Respuestas enviadas exitosamente', 'success');
    } catch (error) {
      showToast('Error al enviar las respuestas', 'error');
      return;
    }
    onClose();
  };

  if (!isOpen) return null;


  if (showGuestRegisterMessage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 min-h-[500px] max-h-[90vh] overflow-y-auto relative">
          {/* Overlay borroso sobre el contenido */}
          <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 mx-4 max-w-lg text-center border">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QuestionMarkCircleIcon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">¡Preguntas adicionales disponibles!</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                El reclutador de este puesto ha preparado algunas preguntas adicionales para conocer mejor a los candidatos.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm font-medium">
                  Para ver y responder estas preguntas, necesitas completar tu registro.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Omitir por ahora
                </button>
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = '/applicant/register';
                  }}
                  className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Registrarse ahora
                </button>
              </div>
            </div>
          </div>
          
          {/* Contenido borroso de fondo (simulando el modal de preguntas) */}
          <div className="opacity-30">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Preguntas adicionales</h2>
                  <p className="text-gray-600 text-sm mt-1">Introducción</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QuestionMarkCircleIcon className="h-8 w-8 text-teal-600" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900">¡Casi terminamos!</h2>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  const showIntro = (currentStep === 1 && !hasConfirmed) || questions.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 min-h-[500px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <QuestionMarkCircleIcon className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Preguntas adicionales</h2>
              <p className="text-gray-600 text-sm mt-1">
                {showIntro ? 'Introducción' : `Paso ${currentStep} de ${questions.length}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress indicator */}
        {!showIntro && questions.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index + 1 <= currentStep ? "bg-teal-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-6">
          {showIntro ? (
            <IntroTab 
              onProceed={() => setHasConfirmed(true)} 
              onSkip={handleSkip} 
              hasQuestions={questions.length > 0}
            />
          ) : (
            <QuestionsTab
              questions={questions}
              answers={answers}
              isLoading={isLoading}
              error={error}
              onAnswerChange={handleAnswerChange}
              onSubmit={handleSubmit}
              currentStep={currentStep}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Pestaña de introducción
const IntroTab = ({ onProceed, onSkip, hasQuestions = true }: { onProceed: () => void; onSkip: () => void; hasQuestions?: boolean }) => {
  if (!hasQuestions) {
    return (
      <div>
        {/* Success message when no questions */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Aplicación completada!</h2>
          <p className="text-gray-600 leading-relaxed">
            Tu aplicación ha sido enviada exitosamente. No hay preguntas adicionales para este puesto.
          </p>
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <button
            onClick={onSkip}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Icon and main content */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <QuestionMarkCircleIcon className="h-8 w-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Ayúdanos a conocerte mejor!</h2>
        <p className="text-gray-600 leading-relaxed">
          El reclutador ha preparado algunas preguntas adicionales que lo ayudarán a conocer más sobre tu perfil y
          experiencia.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <CheckCircleIcon className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-teal-900 mb-2">¿Por qué es importante?</h4>
            <ul className="text-sm text-teal-800 space-y-1">
              <li>• Ayuda al reclutador a conocer mejor tu perfil</li>
              <li>• Puede mejorar tus posibilidades de ser seleccionado</li>
              <li>• Todas las preguntas son completamente opcionales</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onSkip}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          No, omitir
        </button>
        <button
          onClick={onProceed}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
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
                        onSubmit,
                        currentStep,
                        onNext,
                        onPrevious,
                        isSubmitting
                      }: {
  questions: JobQuestion[];
  answers: QuestionAnswer[];
  isLoading: boolean;
  error: string | null;
  onAnswerChange: (questionId: string, answer: string) => void;
  onSubmit: () => void;
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600 mx-auto mb-6"></div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Cargando preguntas...</h3>
        <p className="text-gray-500">Por favor espera un momento</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
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
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DocumentTextIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin preguntas adicionales</h3>
        <p className="text-gray-500">No hay preguntas adicionales para esta posición.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentStep - 1];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id)?.answer || '';

  return (
    <div>
      {/* Question form */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-base font-medium text-gray-900">
              Pregunta {currentStep} de {questions.length}
            </label>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              Opcional
            </span>
          </div>
          <p className="text-gray-700 mb-4 text-lg">{currentQuestion.text}</p>
          
          {currentQuestion.type === 'OPEN' && (
            <textarea
              value={currentAnswer}
              onChange={(e) => onAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="w-full min-h-32 p-4 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none resize-none transition-colors"
            />
          )}

          {currentQuestion.type === 'YES_NO' && (
            <div className="flex gap-6">
              {['Sí', 'No'].map((option) => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={currentAnswer === option}
                    onChange={(e) => onAnswerChange(currentQuestion.id, e.target.value)}
                    className="mr-3 w-5 h-5 text-teal-600 focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="text-gray-700 font-medium">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'NUMERICAL' && (
            <input
              type="number"
              value={currentAnswer}
              onChange={(e) => onAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Ingresa un número..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition-colors"
            />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          onClick={onSubmit}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          No, omitir
        </button>

        <div className="flex space-x-3">
          {currentStep > 1 && (
            <button
              onClick={onPrevious}
              className="px-6 py-3 text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors font-medium"
            >
              Anterior
            </button>
          )}

          {currentStep < questions.length ? (
            <button
              onClick={onNext}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Finalizar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobQuestionsModal;
