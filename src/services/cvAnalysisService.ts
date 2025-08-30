import { CONFIG } from '@/config';
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
    `${CONFIG.apiUrl}/recruiter/get-cvs-analysis-results?job_id=${jobId}`
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

export const deleteApplicantsFromJob = async (jobId: string, cvIds: string[]): Promise<void> => {
  const response = await fetchWithAuth(
    `${CONFIG.apiUrl}/recruiter/job-postings/${jobId}/delete-applications`,
    {
      method: 'POST',
      body: JSON.stringify({ cv_ids: cvIds }),
    }
  );

  if (!response.ok) {
    let errorMessage = 'Error al eliminar aplicantes';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
}; 