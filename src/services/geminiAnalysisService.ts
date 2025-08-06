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
  console.log('📤 Enviando request de eliminación:', { jobId, cvIds });
  
  const payload = { cv_ids: cvIds };
  console.log('📦 Payload:', payload);
  
  const response = await fetchWithAuth(
    `https://vx1fi1v2v7.execute-api.us-east-2.amazonaws.com/dev/recruiter/job-postings/${jobId}/delete_analysis_results`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  );

  console.log('📥 Respuesta del servidor:', response.status, response.statusText);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ Error response:', errorData);
    
    if (response.status === 401) throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    if (response.status === 404) throw new Error('No se encontraron los resultados de análisis especificados.');
    if (response.status === 400) throw new Error(`Datos inválidos: ${errorData.message || 'Error desconocido'}`);
    if (response.status === 403) throw new Error('No tienes permisos para eliminar estos resultados.');
    throw new Error(`Error al eliminar los resultados de análisis: ${errorData.error || errorData.message || 'Error desconocido'}`);
  }
  
  const successData = await response.json().catch(() => ({}));
  console.log('✅ Respuesta exitosa:', successData);
}; 