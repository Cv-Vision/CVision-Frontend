import { useState } from 'react';
import { CONFIG } from '@/config';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export interface GuestApplicationData {
  name: string;
  email: string;
  jobId: string;
  cvData: {
    file: File;
    cvUrl: string;
    fileName: string;
    fileSize: number;
    [key: string]: any;
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

  const generatePresignedUrl = async (file: File): Promise<{upload_url: string, s3_key: string, content_type: string} | null> => {
    try {
      const response = await fetchWithAuth(`${CONFIG.apiUrl}/upload/cv`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          fileType: file.type
        })
      });

      if (!response.ok) {
        throw new Error('Error generating presigned URL');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error generating presigned URL:', err);
      return null;
    }
  };

  const uploadFileToS3 = async (file: File, presignedData: {upload_url: string, s3_key: string, content_type: string}): Promise<boolean> => {
    try {
      const response = await fetch(presignedData.upload_url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': presignedData.content_type,
        },
      });

      if (!response.ok) {
        throw new Error('Error uploading file to S3');
      }

      return true;
    } catch (err) {
      console.error('Error uploading file to S3:', err);
      return false;
    }
  };

  const applyAsGuest = async (applicationData: GuestApplicationData): Promise<GuestApplicationResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Generate presigned URL for CV upload
      const presignedData = await generatePresignedUrl(applicationData.cvData.file);
      if (!presignedData) {
        throw new Error('Error generating upload URL for CV');
      }

      // Step 2: Upload CV to S3
      const file = applicationData.cvData.file;
      
      const uploadSuccess = await uploadFileToS3(file, presignedData);
      if (!uploadSuccess) {
        throw new Error('Error uploading CV to S3');
      }

      // Step 3: Submit guest application
      const response = await fetchWithAuth(`${CONFIG.apiUrl}/guest/job-postings/${applicationData.jobId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: applicationData.name,
          email: applicationData.email,
          cv_upload_key: presignedData.s3_key
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
