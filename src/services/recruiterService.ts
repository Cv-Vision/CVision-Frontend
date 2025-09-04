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
    // Solo guardar el perfil en el backend, sin Cognito
    // CÓDIGO REAL (descomentado):
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

    // Retornar el email para la confirmación (username = email)
    return { username: profile.basicInfo.email, email: profile.basicInfo.email };
  } catch (error) {
    console.error('Error en registerRecruiter:', error);
    throw error;
  }
};

// Función para obtener el resumen del dashboard del reclutador
export const getDashboardSummary = async (token: string): Promise<{ active_postings_count: number; applications_count: number }> => {
  const response = await fetch(`${CONFIG.apiUrl}/recruiter/dashboard-summary`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al obtener el resumen');
  }
  return response.json();
};
