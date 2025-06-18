import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { chatbotService } from '../services/chatbotService';
// import { useParams } from 'react-router-dom';

interface Message {
  type: 'bot' | 'user';
  content: string;
}

interface SoftSkillsChatbotProps {
  onClose: () => void;
  onSubmit: (answers: string[]) => void;
}

// const SOFT_SKILLS_QUESTIONS = [
//   "¿Podrías contarme sobre una situación en la que tuviste que trabajar en equipo para resolver un problema complejo?",
//   "Describe un momento en el que tuviste que manejar un conflicto en el trabajo. ¿Cómo lo resolviste?",
//   "¿Cuál ha sido tu experiencia más significativa como líder o guiando a un equipo?",
//   "¿Cómo manejas situaciones de estrés o presión en el trabajo?",
//   "¿Podrías compartir un ejemplo de cómo has adaptado tu estilo de comunicación para trabajar efectivamente con diferentes tipos de personas?"
// ];

// const INITIAL_GREETING = "¡Hola! Soy tu asistente de evaluación de habilidades blandas. Voy a hacerte algunas preguntas para conocer mejor tus competencias. ¿Estás listo para comenzar?";

const SoftSkillsChatbot: React.FC<SoftSkillsChatbotProps> = ({ onClose, onSubmit }) => {
  // const { jobId } = useParams<{ jobId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startConversation();
  }, []);

  const startConversation = async () => {
    try {
      setIsLoading(true);
      const response = await chatbotService.startConversation();
      setMessages([{ type: 'bot', content: response.message }]);
    } catch (err) {
      setError('Error al iniciar la conversación. Por favor, intenta de nuevo.');
      console.error('Error starting conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    setUserInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setAnswers(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatbotService.sendMessage(userMessage);
      
      if (response.isComplete) {
        // Si la conversación está completa, enviamos todas las respuestas para evaluación
        const evaluation = await chatbotService.submitEvaluation(answers);
        setMessages(prev => [
          ...prev,
          { type: 'bot', content: response.message },
          { type: 'bot', content: `Evaluación completada. Puntuación: ${evaluation.score}/100\n\n${evaluation.analysis}` }
        ]);
        onSubmit(answers);
      } else {
        setMessages(prev => [...prev, { type: 'bot', content: response.message }]);
      }
    } catch (err) {
      setError('Error al procesar tu respuesta. Por favor, intenta de nuevo.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-md h-[600px] bg-white rounded-lg shadow-xl flex flex-col z-50">
      <div className="flex justify-between items-center p-4 border-b bg-blue-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-400" />
          <h3 className="text-lg font-bold text-gray-800">Evaluación de Habilidades Blandas</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu respuesta..."
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!userInput.trim() || isLoading}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoftSkillsChatbot; 