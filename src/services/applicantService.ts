import { getIdToken } from '@/services/AuthService';
import { ApplicantProfile } from '@/types/applicant.ts';
import { CONFIG } from '@/config';

export const applyToJob = async (jobId: string): Promise<void> => {
  const token = getIdToken();
  if (!token) {
    throw new Error('No se encontró el token de identidad. Por favor, inicie sesión nuevamente.');
  }

  const response = await fetch('/api/applicant/apply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ jobId }),
    credentials: 'include',
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
export const uploadCV = async (file: File): Promise<string> => {
  try {
    // TEMPORAL: Simulamos la subida del CV para evitar problemas de CORS
    // TODO: Descomentar cuando se solucione CORS en el backend
    console.log('Simulando subida de CV:', file.name);
    
    // Simular delay de subida
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Retornar una URL simulada
    const simulatedUrl = `https://cvision-bucket.s3.us-east-2.amazonaws.com/simulated-cv-${Date.now()}.pdf`;
    console.log('CV simulado subido a:', simulatedUrl);
    
    return simulatedUrl;
    
    /*
    // CÓDIGO REAL (comentado hasta solucionar CORS):
    // Obtener URL presignada para subir el CV
    const presignedUrlResponse = await fetch(`${CONFIG.apiUrl}/cv/generate-presigned-url`, {
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

    const { uploadUrl, s3Key } = await presignedUrlResponse.json();

    // Subir el archivo usando la URL presignada
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Error al subir el archivo CV');
    }

    // Retornar la URL del archivo subido
    return `${CONFIG.bucketUrl}${s3Key}`;
    */
  } catch (error) {
    console.error('Error en uploadCV:', error);
    throw error;
  }
};
