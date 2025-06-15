import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getGeminiAnalysisResults, GeminiAnalysisResult } from '../../services/geminiAnalysisService';
import AnalysisButton from '../../components/AnalysisButton';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const CVAnalysisResultCard = ({ result }: { result: GeminiAnalysisResult }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          {result.cv_name || result.participant_id}
        </h3>
        <p className="text-sm text-gray-500">
          Analizado el {new Date(result.timestamp).toLocaleString()}
        </p>
        {result.position && (
          <p className="text-sm text-gray-500">Puesto: <span className="font-semibold">{result.position}</span></p>
        )}
      </div>
      <div className="flex items-center">
        <div className="text-2xl font-bold text-blue-600">
          {result.score}%
        </div>
      </div>
    </div>
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-2">Razones técnicas</h4>
      <ul className="list-disc list-inside space-y-2">
        {result.reasons.map((reason, idx) => (
          <li key={idx} className="text-gray-700">{reason}</li>
        ))}
      </ul>
    </div>
    {result.soft_skills_reasons && result.soft_skills_reasons.length > 0 && (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Razones de habilidades blandas</h4>
        <ul className="list-disc list-inside space-y-2">
          {result.soft_skills_reasons.map((reason, idx) => (
            <li key={idx} className="text-gray-700">{reason}</li>
          ))}
        </ul>
      </div>
    )}
    {result.soft_skills_questions && result.soft_skills_questions.length > 0 && (
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Preguntas sugeridas para entrevista</h4>
        <ul className="list-disc list-inside space-y-2">
          {result.soft_skills_questions.map((question, idx) => (
            <li key={idx} className="text-gray-700">{question}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const CVAnalysisSummary = ({ results, onSelectCandidate, selectedCandidateId, onShowAll, showPosition }: {
  results: GeminiAnalysisResult[];
  onSelectCandidate: (id: string) => void;
  selectedCandidateId?: string;
  onShowAll?: () => void;
  showPosition?: string;
}) => {
  if (!results || results.length === 0) return null;
  const total = results.length;
  const avg = Math.round(results.reduce((acc, r) => acc + r.score, 0) / total);
  const maxResult = results.reduce((prev, curr) => (curr.score > prev.score ? curr : prev), results[0]);

  return (
    <div>
      <div className="bg-blue-50 rounded-lg p-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-lg font-semibold text-gray-800">Total de CVs analizados: <span className="font-bold">{total}</span></div>
        <div className="text-lg font-semibold text-gray-800">Promedio de score: <span className="font-bold">{avg}%</span></div>
        <div className="text-lg font-semibold text-gray-800">Score más alto: <span className="font-bold">{maxResult.score}%</span> ({maxResult.cv_name || maxResult.participant_id})</div>
        {showPosition && (
          <div className="text-lg font-semibold text-gray-800">Puesto: <span className="font-bold">{showPosition}</span></div>
        )}
      </div>
      {selectedCandidateId && onShowAll && (
        <button onClick={onShowAll} className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition-colors">Ver todos los análisis</button>
      )}
      {!selectedCandidateId && (
        <div className="grid gap-6">
          {results.map((result, idx) => (
            <div key={idx} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelectCandidate(result.participant_id || result.cv_name || String(idx))}>
              <CVAnalysisResultCard result={result} />
            </div>
          ))}
        </div>
      )}
      {selectedCandidateId && (
        <CVAnalysisResultCard result={results[0]} />
      )}
    </div>
  );
};

const CVAnalysisResults = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const query = useQuery();
  const [results, setResults] = useState<GeminiAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | undefined>(undefined);
  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchResults = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getGeminiAnalysisResults(jobId);
        setResults(data);
        // Si hay highlight en la URL, selecciona ese candidato
        const highlight = query.get('highlight');
        if (highlight) {
          setSelectedCandidateId(highlight);
          // Buscar el puesto del candidato seleccionado
          const found = data.find(r => (r.participant_id || r.cv_name) === highlight);
          setSelectedPosition(found?.position);
        } else {
          setSelectedCandidateId(undefined);
          setSelectedPosition(undefined);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
    // eslint-disable-next-line
  }, [jobId]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    if (jobId) {
      getGeminiAnalysisResults(jobId)
        .then(data => {
          setResults(data);
          setSelectedCandidateId(undefined);
          setSelectedPosition(undefined);
        })
        .catch(err => setError(err instanceof Error ? err.message : 'An error occurred'))
        .finally(() => setLoading(false));
    }
  };

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidateId(id);
    // Buscar el puesto del candidato seleccionado
    const found = results.find(r => (r.participant_id || r.cv_name) === id);
    setSelectedPosition(found?.position);
  };

  const handleShowAll = () => {
    setSelectedCandidateId(undefined);
    // NO limpiar selectedPosition aquí, así el filtro por puesto se mantiene
  };

  const handleAnalysisSuccess = () => {
    // Refresh the results after successful analysis
    handleRetry();
  };

  const handleAnalysisError = (error: string) => {
    setError(error);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h2>
              <p className="text-gray-600 mb-4">No CV analysis results are available for this job posting.</p>
              <button
                onClick={() => navigate(-1)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filtrar resultados
  let filteredResults = results;
  if (selectedCandidateId) {
    filteredResults = results.filter(r => (r.participant_id || r.cv_name) === selectedCandidateId);
  } else if (selectedPosition) {
    filteredResults = results.filter(r => r.position === selectedPosition);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Resultados de Análisis de CVs</h1>
            {jobId && (
              <AnalysisButton
                jobId={jobId}
                onSuccess={handleAnalysisSuccess}
                onError={handleAnalysisError}
              />
            )}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Volver
          </button>
        </div>
        <CVAnalysisSummary
          results={filteredResults}
          onSelectCandidate={handleSelectCandidate}
          selectedCandidateId={selectedCandidateId}
          onShowAll={selectedCandidateId ? handleShowAll : undefined}
          showPosition={selectedPosition}
        />
      </div>
    </div>
  );
};

export default CVAnalysisResults; 