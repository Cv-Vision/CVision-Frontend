import { useState, useEffect } from 'react';
import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  CheckCircleIcon
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

const JobQuestionsModal = ({ isOpen, onClose, jobId }: JobQuestionsModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [hasConfirmed, setHasConfirmed] = useState(false);

  const { questions, isLoading, error, fetchQuestions } = useGetJobQuestions();

  // Reset modal state when it opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setHasConfirmed(false);
      setAnswers([]);
      fetchQuestions(jobId);
    }
  }, [isOpen, jobId, fetchQuestions]);

  // Cerrar automáticamente si no hay preguntas para este puesto
  useEffect(() => {
    if (isOpen && !isLoading && questions.length === 0) {
      onClose();
    }
  }, [isOpen, isLoading, questions, onClose]);


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

  if (!isOpen) return null;

  // Show intro if no questions or if we're on step 1 and haven't started
  const showIntro = questions.length === 0 || (currentStep === 1 && !hasConfirmed);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Custom Header with teal background */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 mb-0 p-6 sm:p-8 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <QuestionMarkCircleIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Preguntas adicionales</h2>
                <p className="text-teal-100 text-sm mt-1">
                  {showIntro ? 'Introducción' : `Paso ${currentStep} de ${questions.length}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full flex items-center justify-center transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Progress indicator */}
          {!showIntro && questions.length > 0 && (
            <div className="flex gap-2 mt-4">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index + 1 <= currentStep ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6 pt-8 sm:p-8 sm:pt-10">
          {showIntro ? (
            <IntroTab onProceed={() => setHasConfirmed(true)} onSkip={handleSkip} />
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Pestaña de introducción
const IntroTab = ({ onProceed, onSkip }: { onProceed: () => void; onSkip: () => void }) => {
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
      <div className="flex justify-between">
        <button
          onClick={onSkip}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-6 py-3 rounded-lg border font-medium transition-colors"
        >
          No, omitir
        </button>
        <button
          onClick={onProceed}
          className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
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
                        onPrevious
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

      {/* Question form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-base font-medium text-gray-900">
            Pregunta {currentStep} de {questions.length}
          </label>
          <p className="text-gray-700 mt-1 mb-3">{currentQuestion.text}</p>
          
          {currentQuestion.type === 'OPEN' && (
            <textarea
              value={currentAnswer}
              onChange={(e) => onAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Escribe tu respuesta aquí..."
              className="w-full min-h-32 p-4 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-teal-200 focus:ring-2 focus:outline-none resize-none transition-all"
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
                    className="mr-3 w-5 h-5 text-teal-600 focus:ring-teal-500"
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
              className="w-full p-4 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-teal-200 focus:ring-2 focus:outline-none transition-all"
            />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-between">
        <button
          onClick={onSubmit}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent px-6 py-3 rounded-lg border font-medium transition-colors"
        >
          No, omitir
        </button>

        <div className="flex gap-2">
          {currentStep > 1 && (
            <button
              onClick={onPrevious}
              className="border-teal-300 text-teal-700 hover:bg-teal-50 bg-transparent px-6 py-3 rounded-lg border font-medium transition-colors"
            >
              Anterior
            </button>
          )}

          {currentStep < questions.length ? (
            <button
              onClick={onNext}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={onSubmit}
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              ¡Sí, responder!
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobQuestionsModal;
