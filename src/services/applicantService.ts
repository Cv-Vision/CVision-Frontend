import { getIdToken } from '@/services/AuthService';
import { ApplicantProfile } from '@/types/applicant.ts';
import { CONFIG } from '@/config';
import { fetchWithAuth } from './fetchWithAuth';

interface QuestionAnswer {
  questionId: string;
  answerText: string;
}

export const applyToJob = async (jobId: string): Promise<void> => {
  const token = getIdToken();
  if (!token) {
    throw new Error('No se encontró el token de identidad. Por favor, inicie sesión nuevamente.');
  }

  const response = await fetchWithAuth(`${CONFIG.apiUrl}/job-postings/${jobId}/applications`, {
    method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
  });

  if (response.ok || response.status === 409) {
    return;
  }

  let errorData: any;
  try {
    errorData = await response.json();
  } catch {
    errorData = {};
  }

  const errorMessage = errorData.error || errorData.message || `Error en la solicitud: ${response.status}`;
  throw new Error(errorMessage);
};

// Función para registrar un candidato
export const registerApplicant = async (profile: ApplicantProfile): Promise<{ username: string; email: string }> => {
  try {
    const profileResponse = await fetch(`${CONFIG.apiUrl}/applicant/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: profile.basicInfo.email,
        fullName: profile.basicInfo.fullName,
        workExperience: profile.workExperience,
        education: profile.education,
        cvUrl: profile.cvUrl || null,
      }),
    });

    if (!profileResponse.ok) {
      const error = await profileResponse.json();
      throw new Error(error.message || 'Error al guardar perfil del candidato');
    }

    // Return email for confirmation (username = email)
    return { username: profile.basicInfo.email, email: profile.basicInfo.email };
  } catch (error) {
    console.error('Error en registerApplicant:', error);
    throw error;
  }
};

// Función para subir CV y obtener URL presignada
export const uploadCV = async (file: File): Promise<{cvUrl: string, s3Key: string}> => {
  try {
    // Obtener URL presignada para subir el CV
    const presignedUrlResponse = await fetchWithAuth(`${CONFIG.apiUrl}/upload/cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        fileType: file.type,
      }),
    });

    if (!presignedUrlResponse.ok) {
      const error = await presignedUrlResponse.json();
      throw new Error(error.message || 'Error al obtener URL presignada');
    }

    const { upload_url, s3_key } = await presignedUrlResponse.json();

    // Subir el archivo usando la URL presignada
    const uploadResponse = await fetch(upload_url, {
      method: 'PUT',
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Error al subir el archivo CV');
    }

    // Retornar la URL del archivo subido
    return {"cvUrl": upload_url, s3Key: s3_key};

  } catch (error) {
    console.error('Error en uploadCV:', error);
    throw error;
  }
};

// Función para obtener el perfil del aplicante
export const getApplicantProfile = async (): Promise<ApplicantProfile> => {
  try {
    const response = await fetchWithAuth(`${CONFIG.apiUrl}/applicant/profile`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al obtener el perfil del aplicante');
    }

    const profileData = await response.json();
    
    // Transformar los datos del backend al formato de ApplicantProfile
    return {
      basicInfo: {
        email: profileData.email || '',
        fullName: profileData.name || '',
        password: '', // Campo vacío ya que no se usa
      },
      workExperience: profileData.workExperience || [],
      education: profileData.education || [],
      cvUrl: profileData.cvUrl || '',
      userId: profileData.user_id || '',
    };
  } catch (error) {
    console.error('Error en getApplicantProfile:', error);
    throw error;
  }
};

// Función para actualizar el perfil del aplicante
export const updateApplicantProfile = async (profile: ApplicantProfile): Promise<void> => {
  try {
    const response = await fetchWithAuth(`${CONFIG.apiUrl}/applicant/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: profile.basicInfo.email,
        workExperience: profile.workExperience,
        education: profile.education,
        cvUrl: profile.cvUrl || null,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar el perfil del aplicante');
    }
  } catch (error) {
    console.error('Error en updateApplicantProfile:', error);
    throw error;
  }
};

// Función para enviar respuestas a las preguntas de un trabajo
export const submitJobQuestionAnswers = async (jobId: string, answers: QuestionAnswer[], overwrite: boolean = false): Promise<void> => {
  const formattedAnswers = answers.map(answer => ({
    question_id: answer.questionId,
    answer: answer.answerText
  }));
  
  const payload = {
    answers: formattedAnswers
  };
  
  try {
    const response = await fetchWithAuth(`${CONFIG.apiUrl}/job-postings/${jobId}/questions/answers?overwrite=${overwrite}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error && error.message.includes('401')) {
      throw new Error('No autorizado. Por favor, inicia sesión nuevamente.');
    }
    if (error instanceof Error && error.message.includes('500')) {
      throw new Error('Error interno del servidor.');
    }
    throw new Error('Error al enviar las respuestas. Por favor, intenta nuevamente.');
  }
};