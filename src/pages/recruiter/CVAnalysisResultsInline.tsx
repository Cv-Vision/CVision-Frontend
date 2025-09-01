import { useState } from 'react';
import { GeminiAnalysisResult } from '@/services/geminiAnalysisService';
import { useGetAnalysisResults } from '@/hooks/useGetAnalysisResults';
import { ChartBarIcon, DocumentTextIcon, TrophyIcon } from '@heroicons/react/24/outline';

// Extiendo el tipo para soportar created_at
interface GeminiAnalysisResultWithCreatedAt extends GeminiAnalysisResult {
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

export const CVAnalysisMetricsSummary = ({ results }: { results: GeminiAnalysisResultWithCreatedAt[] }) => {
  if (!results || results.length === 0) return null;
  const total = results.length;
  const avg = Math.round(results.reduce((acc, r) => acc + r.score, 0) / total);
  const maxResult = results[0];
  // Tooltip state
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="space-y-4">
      {/* Total de CVs analizados */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <DocumentTextIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total analizados</p>
            <p className="text-xl font-bold text-gray-800">{total}</p>
          </div>
        </div>
      </div>

      {/* Promedio de score */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
            <ChartBarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Promedio</p>
            <p className="text-xl font-bold text-gray-800">{avg}%</p>
          </div>
        </div>
      </div>

      {/* Score más alto */}
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 relative">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
            <TrophyIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Mejor score</p>
            <div className="flex items-center space-x-2">
              <p className="text-xl font-bold text-gray-800">{maxResult.score}%</p>
              <button
                className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Tooltip mejorado */}
        {showTooltip && (
          <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-sm min-w-[200px]">
            <div className="flex items-center space-x-2 mb-2">
              <TrophyIcon className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-gray-800">Mejor aplicante</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-medium text-gray-800 truncate ml-2">{maxResult.name || maxResult.cv_name || maxResult.participant_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Score:</span>
                <span className="font-bold text-green-600">{maxResult.score}%</span>
              </div>
            </div>
            {/* Flecha del tooltip */}
            <div className="absolute -top-2 right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white"></div>
          </div>
        )}
      </div>
    </div>
  );
};

const CVAnalysisResultCard = ({ result }: { result: GeminiAnalysisResultWithCreatedAt }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
    <div className="flex justify-between items-start mb-6">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {result.name || result.cv_name || result.participant_id}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Analizado el {formatDate(result.created_at || result.timestamp)}</span>
          </div>
        {result.position && (
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
              <span>Puesto: <span className="font-semibold text-gray-700">{result.position}</span></span>
            </div>
        )}
        </div>
      </div>
      <div className="flex items-center">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl shadow-md">
          <div className="text-2xl font-bold">{result.score}%</div>
        </div>
      </div>
    </div>
    
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Razones</span>
      </h4>
      <ul className="space-y-2">
        {result.reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start space-x-2 text-gray-700">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </div>
    
    {result.soft_skills_reasons && result.soft_skills_reasons.length > 0 && (
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Habilidades blandas</span>
        </h4>
        <ul className="space-y-2">
          {result.soft_skills_reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start space-x-2 text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {result.soft_skills_questions && result.soft_skills_questions.length > 0 && (
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Preguntas sugeridas</span>
        </h4>
        <ul className="space-y-2">
          {result.soft_skills_questions.map((question, idx) => (
            <li key={idx} className="flex items-start space-x-2 text-gray-700">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>{question}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const CVAnalysisResultsInline = ({ jobId }: { jobId: string }) => {
  const { results, isLoading, error } = useGetAnalysisResults(jobId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 p-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 rounded-full bg-red-100">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-800">Error al cargar resultados</h2>
          <p className="text-red-600 max-w-md">{error}</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 rounded-full bg-gray-100">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">No hay resultados disponibles</h2>
          <p className="text-gray-600">No se encontraron resultados de análisis para este puesto.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6">
        {results.slice(0, 3).map((result, idx) => (
          <CVAnalysisResultCard key={idx} result={result} />
        ))}
      </div>
    </div>
  );
};

export default CVAnalysisResultsInline;
