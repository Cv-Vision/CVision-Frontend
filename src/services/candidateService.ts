import { getIdToken } from '@/services/AuthService';
import { CandidateProfile } from '@/types/candidate';

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

export const updateProfile = async (profileData: CandidateProfile, cvFile?: string): Promise<{ message: string }> => {
  const token = getIdToken();
  if (!token) {
    throw new Error('No se encontró el token de identidad. Por favor, inicie sesión nuevamente.');
  }

  // Prepare data for backend
  const payload: any = {
    name: profileData.basicInfo.fullName,
    workExperience: profileData.workExperience,
    education: profileData.education
  };

  // Add CV file if provided
  if (cvFile) {
    payload.cvFile = cvFile;
  }

  const response = await fetch('/api/candidate/update-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    credentials: 'include',
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  let errorData: any;
  try {
    errorData = await response.json();
  } catch {
    errorData = {};
  }

  const errorMessage = errorData.error || errorData.message || `Error al actualizar perfil: ${response.status}`;
  throw new Error(errorMessage);
};
