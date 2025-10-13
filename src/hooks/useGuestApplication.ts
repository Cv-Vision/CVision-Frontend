import { useState } from 'react';
import { CONFIG } from '@/config';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export interface GuestApplicationData {
  name: string;
  email: string;
  jobId: string;
  cvData: {
    cvUrl: string;
    fileName: string;
    fileSize: number;
    uploadKey: string;
  };
}

export interface GuestApplicationResponse {
  application_id: string;
  message: string;
}

export interface GuestApplicationError {
  message: string;
  error_code?: string;
  [key: string]: any;
}

export function useGuestApplication() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyAsGuest = async (applicationData: GuestApplicationData): Promise<GuestApplicationResponse> => {
    setIsLoading(true);
    setError(null);

    try {

      const { cvData } = applicationData;

      const response = await fetchWithAuth(`${CONFIG.apiUrl}/guest/job-postings/${applicationData.jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: applicationData.name,
          email: applicationData.email,
          cv_upload_key: cvData.uploadKey,
        })
      });

      if (!response.ok) {
        const errorData: GuestApplicationError = await response.json();
        
        // Manejar específicamente el error de email ya registrado
        if (errorData.error_code === 'EMAIL_ALREADY_REGISTERED') {
          throw new Error('EMAIL_ALREADY_REGISTERED');
        }
        
        throw new Error(errorData.message || 'Error submitting guest application');
      }

      const result: GuestApplicationResponse = await response.json();
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error submitting guest application';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applyAsGuest,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}
