import React, { useState } from 'react';
import { useJobs, Job } from '../../context/JobContext';
import ChatBox from '../../components/ChatBox';
import BackButton from '@/components/BackButton';
import { ListBulletIcon } from '@heroicons/react/24/solid';
import { CVDropzone } from '../../components/CVDropzone';

const JobListings: React.FC = () => {
  const { jobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedCvUrls, setUploadedCvUrls] = useState<string[]>([]);

  const handleCvUploadComplete = (fileUrls: string[]) => {
    // TODO remove this upload call when variable is used in the future, this is here to fix build issues
    uploadedCvUrls;
    setUploadedCvUrls(fileUrls);
    setCvUploaded(true);
    if (selectedJob?.questions && selectedJob.questions.length > 0) {
      setShowChat(true);
    } else {
      alert('¡CVs subidos exitosamente! Esta empresa no requiere entrevista por chat.');
    }
  };

  const handleCvUploadError = (error: string) => {
    setUploadError(error);
    setTimeout(() => setUploadError(null), 5000); // Clear error after 5 seconds
  };

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setCvUploaded(false);
    setUploadedCvUrls([]);
    setShowChat(false);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedJob(null);
    setCvUploaded(false);
    setUploadedCvUrls([]);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center py-10 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full p-10 flex flex-col items-center">
        <BackButton />
        <ListBulletIcon className="h-10 w-10 text-blue-400 mb-4" />
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Posiciones disponibles</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Job List */}
          <div className="space-y-6">
            {jobs.map((job) => (
              <li key={job.id} className="bg-blue-50 rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between list-none">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{job.title} <span className="text-sm text-gray-500">({job.company})</span></h3>
                  <p className="text-gray-700 mb-2">{job.description}</p>
                  <span className="text-xs text-gray-400">Preguntas de entrevista: {job.questions.length > 0 ? 'Sí' : 'No'}</span>
                </div>
                <button
                  className={`mt-4 md:mt-0 px-4 py-2 rounded-lg shadow transition-colors font-semibold ${
                    selectedJob?.id === job.id
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-blue-400 text-white hover:bg-blue-600'
                  }`}
                  onClick={() => handleApply(job)}
                >
                  {selectedJob?.id === job.id ? 'Seleccionado' : 'Aplicar'}
                </button>
              </li>
            ))}
          </div>

          {/* CV Upload Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            {selectedJob ? (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Subir CV para: {selectedJob.title}
                </h3>
                <CVDropzone
                  jobId={selectedJob.id.toString()}
                  onUploadComplete={handleCvUploadComplete}
                  onError={handleCvUploadError}
                />
                {uploadError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                    {uploadError}
                  </div>
                )}
                {cvUploaded && (
                  <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-md text-sm">
                    CVs subidos exitosamente
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Selecciona un puesto para subir tu CV
              </div>
            )}
          </div>
        </div>

        {showChat && selectedJob && cvUploaded && (
          <ChatBox job={selectedJob} onClose={handleCloseChat} />
        )}
      </div>
    </div>
  );
};

export default JobListings; 