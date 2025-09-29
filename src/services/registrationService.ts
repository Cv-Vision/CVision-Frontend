import { CONFIG } from '@/config';

export type UserRole = 'APPLICANT' | 'RECRUITER' | 'ADMIN';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // optional, defaults to APPLICANT on backend
}

interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch(`${CONFIG.apiUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // ignore json parse error
  }

  if (!res.ok) {
    const msg = data?.message || data?.error || `Registro falló (${res.status})`;
    throw new Error(msg);
  }

  return data as RegisterResponse;
}

