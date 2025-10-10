import { useState } from 'react';
import { CONFIG } from '@/config';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export interface GuestCompleteData {
  token: string;
  name: string;
  phone?: string;
  password?: string;
}

export interface GuestCompleteResponse {
  success: boolean;
  user_id?: string;
  email?: string;
  name?: string;
  message?: string;
}

export interface GuestTokenStatus {
  valid: boolean;
  application_id?: string;
  expires_at?: string;
  message?: string;
}

export function useGuestComplete() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateToken = async (token: string): Promise<GuestTokenStatus> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${CONFIG.apiUrl}/guest/complete?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error validating token');
      }

      const result: GuestTokenStatus = await response.json();
      return { ...result, valid: result.status === 'active' || result.status === 'valid' };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error validating token';
      setError(errorMessage);
      return { valid: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async (data: GuestCompleteData): Promise<GuestCompleteResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`${CONFIG.apiUrl}/guest/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: data.token,
          name: data.name,
          phone: data.phone,
          portfolio_url: data.portfolio_url,
          password: data.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error completing profile');
      }

      const result: GuestCompleteResponse = await response.json();
      return { ...result, success: true };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error completing profile';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resendGuestLink = async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth(`${CONFIG.apiUrl}/guest/resend-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error resending link');
      }

      const result = await response.json();
      return { success: true, message: result.message || 'Link reenviado exitosamente' };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error resending link';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    validateToken,
    completeProfile,
    resendGuestLink,
    isLoading,
    error
  };
}
