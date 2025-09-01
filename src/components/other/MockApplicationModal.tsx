import { Dialog } from '@headlessui/react';
import { XMarkIcon, QuestionMarkCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface MockApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  jobTitle?: string;
}

const MockApplicationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  jobTitle = 'esta posición'
}: MockApplicationModalProps) => {
  const [answers, setAnswers] = useState({
    question1: '',
    question3: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleAnswerChange = (question: keyof typeof answers, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Mock submission - simulate loading
    setShowSuccessMessage(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Close modal and call onConfirm
      onConfirm();
      // Reset modal state
      resetModal();
    }, 1500);
  };

  const resetModal = () => {
    setAnswers({ question1: '', question3: '' });
    setCurrentStep(1);
    setIsCompleted(false);
    setShowSuccessMessage(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const questions = [
    {
      id: 'question1',
      question: '¿Por qué te interesa trabajar en esta empresa?',
      placeholder: 'Describe tu motivación para unirte a nuestro equipo...',
      type: 'textarea'
    },
    {
      id: 'question3',
      question: '¿Cuáles son tus expectativas salariales?',
      placeholder: 'Rango salarial esperado...',
      type: 'text'
    }
  ];

  const currentQuestion = questions[currentStep - 1];

  return (
    <Dialog open={isOpen} onClose={handleClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="relative bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <Dialog.Title className="text-xl font-bold text-gray-900">
                  Postulación a {jobTitle}
                </Dialog.Title>
                <p className="text-sm text-gray-600">Paso {currentStep} de 2</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading || showSuccessMessage}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex space-x-2">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                    step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {showSuccessMessage ? (
            /* Success Message Screen */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">
                ¡Postulación enviada con éxito!
              </h3>
              <p className="text-gray-600 mb-6">
                Tu aplicación ha sido recibida. Hemos guardado tus respuestas y te contactaremos pronto.
              </p>
              
              <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-green-800 mb-2">Resumen de tu postulación:</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Motivación:</strong> {answers.question1.substring(0, 50)}...</p>
                  <p><strong>Expectativas salariales:</strong> {answers.question3}</p>
                </div>
              </div>
              
              <div className="animate-pulse">
                <div className="text-sm text-gray-500">
                  Cerrando modal en unos segundos...
                </div>
              </div>
            </div>
          ) : !isCompleted ? (
            <>
              {/* Question Content */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {currentQuestion.question}
                </h3>
                
                {currentQuestion.type === 'textarea' ? (
                  <textarea
                    value={answers[currentQuestion.id as keyof typeof answers]}
                    onChange={(e) => handleAnswerChange(currentQuestion.id as keyof typeof answers, e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isLoading}
                  />
                ) : (
                  <input
                    type="text"
                    value={answers[currentQuestion.id as keyof typeof answers]}
                    onChange={(e) => handleAnswerChange(currentQuestion.id as keyof typeof answers, e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1 || isLoading}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id as keyof typeof answers] || isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {currentStep === 2 ? 'Finalizar' : 'Siguiente'}
                </button>
              </div>
            </>
          ) : (
            /* Completion Screen */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                ¡Cuestionario completado!
              </h3>
              <p className="text-gray-600 mb-6">
                Has respondido todas las preguntas. Tu postulación será enviada con esta información adicional.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-gray-800 mb-2">Resumen de respuestas:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Motivación:</strong> {answers.question1.substring(0, 50)}...</p>
                  <p><strong>Expectativas salariales:</strong> {answers.question3}</p>
                </div>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={resetModal}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Editar respuestas
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Enviando...' : 'Enviar postulación'}
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default MockApplicationModal;
