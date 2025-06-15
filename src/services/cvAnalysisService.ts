import { fetchWithAuth } from './fetchWithAuth';

export interface CVAnalysisResult {
  score: number;
  reasons: string[];
  timestamp: string;
  participant_id?: string;
  cv_name?: string;
  soft_skills_questions?: string[];
  soft_skills_reasons?: string[];
  position?: string;
}

export const getCVAnalysisResults = async (jobId: string): Promise<CVAnalysisResult[]> => {
  const response = await fetchWithAuth(
    `https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/get-cvs-analysis-results?job_id=${jobId}`
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    }
    if (response.status === 404) {
      throw new Error('No se encontraron resultados de análisis para este puesto.');
    }
    throw new Error('Error al obtener los resultados de análisis de CVs.');
  }

  const data = await response.json();

  // Mapeo defensivo por si la estructura varía
  return (Array.isArray(data) ? data : []).map((item: any) => ({
    score: item.score,
    reasons: item.reasons || [],
    timestamp: item.timestamp,
    participant_id: item.participant_id,
    cv_name: item.cv_name,
    soft_skills_questions: item.soft_skills_questions || [],
    soft_skills_reasons: item.soft_skills_reasons || [],
    position: item.position,
  }));
}; 