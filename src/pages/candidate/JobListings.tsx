import React, { useState } from 'react';
import { useJobs, Job } from '../../context/JobContext';
import ChatBox from '../../components/ChatBox';
import { ListBulletIcon } from '@heroicons/react/24/solid';

const JobListings: React.FC = () => {
  const { jobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);

  // Simula el upload de CV y luego abre el chat si la empresa lo requiere
  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setCvUploaded(true); // Simula que el CV se subió correctamente
    if (job.questions && job.questions.length > 0) {
      setShowChat(true);
    } else {
      alert('¡Aplicación enviada! Esta empresa no requiere entrevista por chat.');
    }
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedJob(null);
    setCvUploaded(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-10 flex flex-col items-center">
        <ListBulletIcon className="h-10 w-10 text-blue-400 mb-4" />
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Posiciones disponibles</h2>
        <ul className="space-y-6 w-full">
          {jobs.map((job) => (
            <li key={job.id} className="bg-blue-50 rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{job.title} <span className="text-sm text-gray-500">({job.company})</span></h3>
                <p className="text-gray-700 mb-2">{job.description}</p>
                <span className="text-xs text-gray-400">Preguntas de entrevista: {job.questions.length > 0 ? 'Sí' : 'No'}</span>
              </div>
              <button
                className="mt-4 md:mt-0 bg-blue-400 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors font-semibold"
                onClick={() => handleApply(job)}
              >
                Aplicar
              </button>
            </li>
          ))}
        </ul>
        {showChat && selectedJob && cvUploaded && (
          <ChatBox job={selectedJob} onClose={handleCloseChat} />
        )}
      </div>
    </div>
  );
};

export default JobListings; 