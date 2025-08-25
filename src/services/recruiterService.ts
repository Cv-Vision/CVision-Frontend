import { signUp } from './AuthService';

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
    await signUp({
      name: profile.basicInfo.fullName,
      password: profile.basicInfo.password,
      email: profile.basicInfo.email,
      role: 'RECRUITER',
    });

    // Assuming the new backend returns the username/email in the response of signUp
    // For now, we'll return the email and fullName as username
    return { username: profile.basicInfo.fullName, email: profile.basicInfo.email };

  } catch (error) {
    console.error('Error in registerRecruiter:', error);
    throw error;
  }
};