import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getGeminiAnalysisResults,
  GeminiAnalysisResult,
} from '@/services/geminiAnalysisService';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

interface GeminiAnalysisResultWithCreatedAt extends GeminiAnalysisResult {
  created_at?: string;
}

function formatDate(dateString?: string) {
  if (!dateString) return '-';
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
      <h4 className="text-lg font-semibold text-gray-900 mb-2">Razones</h4>
      <ul className="list-disc list-inside space-y-2">
        {result.reasons.map((reason, idx) => (
          <li key={idx} className="text-gray-700">{reason}</li>
        ))}
      </ul>
    </div>

    {Array.isArray(result.soft_skills_reasons) && result.soft_skills_reasons.length > 0 && (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Razones de habilidades blandas</h4>
        <ul className="list-disc list-inside space-y-2">
          {result.soft_skills_reasons.map((reason, idx) => (
            <li key={idx} className="text-gray-700">{reason}</li>
          ))}
        </ul>
      </div>
    )}

    {Array.isArray(result.soft_skills_questions) && result.soft_skills_questions.length > 0 && (
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-2">Preguntas sugeridas para entrevista</h4>
        <ul className="list-disc list-inside space-y-2">
          {result.soft_skills_questions?.map((question, idx) => (
            <li key={idx} className="text-gray-700">{question}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default function CVAnalysisResults() {
  const { jobId } = useParams<{ jobId: string }>();
  const [results, setResults] = useState<GeminiAnalysisResultWithCreatedAt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      try {
        const data = await getGeminiAnalysisResults(jobId);
        const sorted = [...data].sort((a, b) => b.score - a.score);
        setResults(sorted);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  if (loading) {
    return <div className="p-6">Cargando...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  const total = results.length;
  const avg = Math.round(results.reduce((acc, r) => acc + r.score, 0) / total);
  const maxResult = results[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-800 mb-4">
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        <span>Volver</span>
      </button>

      <h1 className="text-2xl font-bold mb-6">Resultados de Análisis de CVs</h1>

      <div className="bg-blue-50 rounded-lg p-4 mb-6 flex flex-wrap gap-8 justify-start">
        <div className="text-lg font-semibold text-gray-800">
          Total de CVs analizados: <span className="font-bold">{total}</span>
        </div>
        <div className="text-lg font-semibold text-gray-800">
          Promedio de score: <span className="font-bold">{avg}%</span>
        </div>
        <div className="text-lg font-semibold text-gray-800">
          Score más alto: <span className="font-bold">{maxResult.score}%</span>
        </div>
      </div>

      <div className="grid gap-6">
        {results.map((result, idx) => (
          <CVAnalysisResultCard key={idx} result={result} />
        ))}
      </div>
    </div>
  );
}
