export function decodeJwtPayload<T = Record<string, unknown>>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const json = atob(padded);
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export type CognitoIdTokenPayload = {
  email?: string;
  given_name?: string;
  family_name?: string;
  'cognito:username'?: string;
  'custom:userType'?: 'candidate' | 'recruiter' | string;
  [key: string]: unknown;
};


