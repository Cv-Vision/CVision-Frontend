import { getIdToken } from '@/services/AuthService';
import { ApplicantProfile } from '@/types/applicant.ts';
import { CONFIG } from '@/config';
import { fetchWithAuth } from './fetchWithAuth';

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
    // TEMPORAL: Simulamos la subida del CV para evitar problemas de CORS
    // TODO: Descomentar cuando se solucione CORS en el backend
    // console.log('Simulando subida de CV:', file.name);
    
    // Simular delay de subida
    // await new Promise(resolve => setTimeout(resolve, 1000));
    
    // // Retornar una URL simulada
    // const simulatedUrl = `https://cvision-bucket.s3.us-east-2.amazonaws.com/simulated-cv-${Date.now()}.pdf`;
    // console.log('CV simulado subido a:', simulatedUrl);
    
    // return simulatedUrl;
    
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
    return {"cvUrl": `${CONFIG.bucketUrl}${s3_key}`, s3Key: s3_key};

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
