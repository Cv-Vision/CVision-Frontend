import { useEffect, useState } from 'react';
import { getGeminiAnalysisResults, GeminiAnalysisResult } from '../../services/geminiAnalysisService';

// Extiendo el tipo para soportar created_at
interface GeminiAnalysisResultWithCreatedAt extends GeminiAnalysisResult {
  name?: string;
  created_at?: string;
}

function formatDate(dateString?: string) {
  if (!dateString) return '-';
  // Elimina microsegundos si existen (mantén solo hasta los milisegundos)
  const clean = dateString.replace(/\.(\d{3})\d*$/, '.$1');
  const date = new Date(clean);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleString();
}

const CVAnalysisResultCard = ({ result }: { result: GeminiAnalysisResultWithCreatedAt }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">
          {result.name || result.cv_name || result.participant_id}
        </h3>
        <p className="text-sm text-gray-500">
          Analizado el {formatDate(result.created_at || result.timestamp)}
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

const CVAnalysisResultsInline = ({ jobId }: { jobId: string }) => {
  const [results, setResults] = useState<GeminiAnalysisResultWithCreatedAt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!jobId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getGeminiAnalysisResults(jobId);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600 mb-2">{error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">No hay resultados</h2>
        <p className="text-gray-600 mb-2">No hay resultados de análisis para este puesto.</p>
      </div>
    );
  }

  // Ordenar resultados de mayor a menor score
  const sortedResults = [...results].sort((a, b) => b.score - a.score);

  // Resumen simple
  const total = sortedResults.length;
  const avg = Math.round(sortedResults.reduce((acc, r) => acc + r.score, 0) / total);
  const maxResult = sortedResults[0];

  return (
    <div>
      <div className="bg-blue-50 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-lg font-semibold text-gray-800">Total de CVs analizados: <span className="font-bold">{total}</span></div>
        <div className="text-lg font-semibold text-gray-800">Promedio de score: <span className="font-bold">{avg}%</span></div>
        <div className="text-lg font-semibold text-gray-800">Score más alto: <span className="font-bold">{maxResult.score}%</span> ({maxResult.name || maxResult.cv_name || maxResult.participant_id})</div>
      </div>
      <div className="grid gap-6">
        {sortedResults.map((result, idx) => (
          <CVAnalysisResultCard key={idx} result={result} />
        ))}
      </div>
    </div>
  );
};

export default CVAnalysisResultsInline; 