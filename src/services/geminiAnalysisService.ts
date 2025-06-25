import { fetchWithAuth } from './fetchWithAuth';

export interface GeminiAnalysisResult {
  score: number;
  name: string;
  reasons: string[];
  timestamp: string;
  participant_id?: string;
  cv_name?: string;
  soft_skills_questions?: string[];
  soft_skills_reasons?: string[];
  position?: string;
  cv_id?: string;
}

export const getGeminiAnalysisResults = async (jobId: string): Promise<GeminiAnalysisResult[]> => {
  const response = await fetchWithAuth(
    `https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/get-cvs-analysis-results?job_id=${jobId}`
  );

  if (!response.ok) {
    if (response.status === 401) throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    if (response.status === 404) throw new Error('No se encontraron resultados para este puesto.');
    throw new Error('Error al obtener los resultados de análisis.');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const deleteAnalysisResults = async (jobId: string, cvIds: string[]): Promise<void> => {
  const response = await fetchWithAuth(
    `https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/job-postings/${jobId}/delete_analysis_results`,
    {
      method: 'POST',
      body: JSON.stringify({ cv_ids: cvIds }),
    }
  );

  if (!response.ok) {
    if (response.status === 401) throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    if (response.status === 404) throw new Error('No se encontraron los resultados de análisis especificados.');
    if (response.status === 400) throw new Error('Datos inválidos para eliminar.');
    throw new Error('Error al eliminar los resultados de análisis.');
  }
}; 