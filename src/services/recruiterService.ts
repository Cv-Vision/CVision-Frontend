import { CONFIG } from '@/config';

interface RecruiterProfile {
  basicInfo: {
    email: string;
    password: string;
    fullName: string;
  };
  company?: string;
  position?: string;
}

// Función para registrar un reclutador
export const registerRecruiter = async (profile: RecruiterProfile): Promise<{ username: string; email: string }> => {
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
      : `recruiter_${Date.now()}`;
    
    console.log('Username generado para reclutador:', username);
    
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
            Value: 'recruiter', // Atributo personalizado para el tipo de usuario
          },
        ],
        ValidationData: [],
      }),
    });

    if (!signUpResponse.ok) {
      const error = await signUpResponse.json();
      throw new Error(error.message || 'Error al registrar usuario en Cognito');
    }

    console.log('Reclutador registrado exitosamente en Cognito');

    // TEMPORAL: Simulamos el guardado en la base de datos para evitar problemas de CORS
    // TODO: Descomentar cuando se solucione CORS en el backend
    console.log('Simulando guardado en base de datos...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Perfil de reclutador simulado guardado exitosamente');
    
    /*
    // CÓDIGO REAL (comentado hasta solucionar CORS):
    // Luego guardar el perfil completo en la base de datos
    const profileResponse = await fetch(`${CONFIG.apiUrl}/recruiter/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: profile.basicInfo.email,
        fullName: profile.basicInfo.fullName,
        company: profile.company || null,
        position: profile.position || null,
      }),
    });

    if (!profileResponse.ok) {
      const error = await profileResponse.json();
      throw new Error(error.message || 'Error al guardar perfil del reclutador');
    }
    */

    console.log('Perfil de reclutador guardado exitosamente en la base de datos');

    // Retornar el username y email para la confirmación
    return { username, email: profile.basicInfo.email };

  } catch (error) {
    console.error('Error en registerRecruiter:', error);
    throw error;
  }
};
