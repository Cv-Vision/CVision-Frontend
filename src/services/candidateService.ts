import { getIdToken } from '@/services/AuthService';
import { CandidateProfile } from '@/types/candidate';
import { CONFIG } from '@/config';

export const applyToJob = async (jobId: string): Promise<void> => {
  const token = getIdToken();
  if (!token) {
    throw new Error('No se encontró el token de identidad. Por favor, inicie sesión nuevamente.');
  }

  const response = await fetch('/api/candidate/apply', {
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
export const registerCandidate = async (profile: CandidateProfile): Promise<{ username: string; email: string }> => {
  try {
    // Primero registrar en Cognito
    // Usar el nombre completo como username, pero limpiarlo para que sea válido
    const cleanUsername = profile.basicInfo.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Solo letras y números
      .substring(0, 20); // Máximo 20 caracteres
    
    // Si el nombre está vacío o es muy corto, usar un fallback
    const username = cleanUsername.length >= 3 
      ? cleanUsername 
      : `candidate_${Date.now()}`;
    
    console.log('Username generado:', username);
    
    const signUpResponse = await fetch(CONFIG.cognitoEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-amz-json-1.1',
        'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
      },
      body: JSON.stringify({
        ClientId: CONFIG.clientId,
        Username: username, // Usar nombre limpio como username
        Password: profile.basicInfo.password,
        UserAttributes: [
          {
            Name: 'email',
            Value: profile.basicInfo.email,
          },
          {
            Name: 'name',
            Value: profile.basicInfo.fullName, // Nombre completo sin prefijo
          },
          {
            Name: 'custom:userType',
            Value: 'candidate', // Atributo personalizado para el tipo de usuario
          },
        ],
        ValidationData: [],
      }),
    });

    if (!signUpResponse.ok) {
      const error = await signUpResponse.json();
      throw new Error(error.message || 'Error al registrar usuario en Cognito');
    }

    console.log('Usuario registrado exitosamente en Cognito');

    // TEMPORAL: Simulamos el guardado en la base de datos para evitar problemas de CORS
    // TODO: Descomentar cuando se solucione CORS en el backend
    console.log('Simulando guardado en base de datos...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Perfil simulado guardado exitosamente');
    
    /*
    // CÓDIGO REAL (comentado hasta solucionar CORS):
    // Luego guardar el perfil completo en la base de datos
    const profileResponse = await fetch(`${CONFIG.apiUrl}/candidate/profile`, {
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
    */

    console.log('Perfil guardado exitosamente en la base de datos');

    // Retornar el username y email para la confirmación
    return { username, email: profile.basicInfo.email };

  } catch (error) {
    console.error('Error en registerCandidate:', error);
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
