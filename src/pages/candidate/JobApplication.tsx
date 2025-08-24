import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWithAuth } from "@/services/fetchWithAuth.ts";

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
        const [jobResponse, questionsResponse] = await Promise.all([
          fetchWithAuth(`/recruiter/job/${jobId}`),
          fetchWithAuth(`/recruiter/job/${jobId}/questions`)
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

      const response = await fetchWithAuth(`/recruiter/job/${jobId}/apply`, {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-blue-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-8">
          Postulación: {job?.title} en {job?.company}
        </h1>

        {/* CV Upload Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">Sube tu CV</h2>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-200 border-dashed rounded-xl bg-white/50 backdrop-blur-sm">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-blue-400"
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
              <div className="flex text-sm text-blue-600">
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
              <p className="text-xs text-blue-500">PDF, DOC o DOCX hasta 10MB</p>
            </div>
          </div>
          {cvFile && (
            <p className="mt-2 text-sm text-blue-600 font-medium">
              Archivo seleccionado: {cvFile.name}
            </p>
          )}
        </div>

        {/* Chat Interface */}
        {questions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">
              Evaluación de Habilidades
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <div className="mb-4">
                <p className="text-sm text-blue-600 font-medium">
                  Pregunta {currentQuestionIndex + 1} de {questions.length}
                </p>
                <p className="text-lg font-semibold text-blue-800 mt-2">
                  {questions[currentQuestionIndex].text}
                </p>
              </div>

              {questions[currentQuestionIndex].type === 'multiple_choice' ? (
                <div className="space-y-4">
                  {questions[currentQuestionIndex].options?.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        answers[questions[currentQuestionIndex].id] === option
                          ? 'bg-blue-100 border-blue-500 text-blue-800'
                          : 'bg-white border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  value={answers[questions[currentQuestionIndex].id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  rows={4}
                  placeholder="Escribe tu respuesta aquí..."
                />
              )}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 border-2 border-blue-200 rounded-xl text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Anterior
                </button>
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105 hover:from-blue-600 hover:to-indigo-700"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105 hover:from-green-600 hover:to-green-700"
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
  );
};

export default JobApplication;