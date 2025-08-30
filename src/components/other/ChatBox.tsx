import React, { useState } from 'react';
import { Job, useJobs } from '../../context/JobContext.tsx';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ChatBoxProps {
  job: Job;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ job, onClose }) => {
  const { addApplication } = useJobs();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(job.questions.length).fill(''));
  const [finished, setFinished] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswers = [...answers];
    newAnswers[current] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (current < job.questions.length - 1) {
      setCurrent(current + 1);
    } else {
      // Guardar mock de aplicación
      addApplication({ jobId: job.pk, answers, applicant: 'mock-applicant' });
      setFinished(true);
    }
  };

  return (
    <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 rounded-l-2xl border-l-4 border-blue-200">
      <div className="flex justify-between items-center p-4 border-b bg-blue-50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <ChatBubbleLeftRightIcon className="h-7 w-7 text-blue-400" />
          <h3 className="text-lg font-bold text-gray-800">Entrevista para {job.title} ({job.company})</h3>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl"><XMarkIcon className="h-7 w-7" /></button>
      </div>
      <div className="flex-1 p-6 flex flex-col justify-center">
        {!finished ? (
          <>
            <p className="mb-4 text-gray-700 font-semibold text-lg">{job.questions[current]}</p>
            <input
              type="text"
              className="w-full border border-blue-200 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={answers[current]}
              onChange={handleChange}
              placeholder="Tu respuesta..."
              autoFocus
            />
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition-colors font-semibold"
              onClick={handleNext}
              disabled={!answers[current]}
            >
              {current < job.questions.length - 1 ? 'Siguiente' : 'Finalizar'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-bold mb-4 text-lg">¡Entrevista completada y aplicación enviada!</p>
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition-colors font-semibold"
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox; 