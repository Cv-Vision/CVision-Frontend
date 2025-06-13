import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'multiple_choice';
  options?: string[];
}

interface Job {
  id: string;
  title: string;
  company: string;
}

const JobApplication = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobAndQuestions = async () => {
      try {
        // TODO: Replace with actual API calls
        const [jobResponse, questionsResponse] = await Promise.all([
          fetch(`/api/jobs/${jobId}`),
          fetch(`/api/jobs/${jobId}/questions`)
        ]);

        if (!jobResponse.ok || !questionsResponse.ok) {
          throw new Error('Failed to fetch job details or questions');
        }

        const [jobData, questionsData] = await Promise.all([
          jobResponse.json(),
          questionsResponse.json()
        ]);

        setJob(jobData);
        setQuestions(questionsData);
      } catch (err) {
        setError('Error al cargar la información del trabajo');
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndQuestions();
  }, [jobId]);

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!cvFile) {
      setError('Por favor, sube tu CV');
      return;
    }

    for (const q of questions) {
      if (!answers[q.id] || answers[q.id].trim() === '' ) {
        setError(`Por favor respondar la pregunta: "${q.text}"`)
      }
    }

    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      formData.append('answers', JSON.stringify(answers));

      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      navigate('/candidate/applications');
    } catch (err) {
      setError('Error al enviar la postulación');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Postulación: {job?.title} en {job?.company}
            </h1>

            {/* CV Upload Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sube tu CV</h2>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="cv-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Sube un archivo</span>
                      <input
                        id="cv-upload"
                        name="cv-upload"
                        type="file"
                        className="sr-only"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvUpload}
                      />
                    </label>
                    <p className="pl-1">o arrastra y suelta</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC o DOCX hasta 10MB</p>
                </div>
              </div>
              {cvFile && (
                <p className="mt-2 text-sm text-gray-500">
                  Archivo seleccionado: {cvFile.name}
                </p>
              )}
            </div>

            {/* Chat Interface */}
            {questions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Evaluación de Habilidades
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Pregunta {currentQuestionIndex + 1} de {questions.length}
                    </p>
                    <p className="text-lg font-medium text-gray-900 mt-2">
                      {questions[currentQuestionIndex].text}
                    </p>
                  </div>

                  {questions[currentQuestionIndex].type === 'multiple_choice' ? (
                    <div className="space-y-4">
                      {questions[currentQuestionIndex].options?.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          className={`w-full text-left px-4 py-2 rounded-md ${
                            answers[questions[currentQuestionIndex].id] === option
                              ? 'bg-blue-100 border-blue-500'
                              : 'bg-white border-gray-300'
                          } border`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={answers[questions[currentQuestionIndex].id] || ''}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Escribe tu respuesta aquí..."
                    />
                  )}

                  <div className="mt-6 flex justify-between">
                    <button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    {currentQuestionIndex < questions.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Siguiente
                      </button>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Enviar Postulación
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplication; 