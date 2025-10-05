import { useState, useCallback } from 'react';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { CONFIG } from '@/config';

interface ValidationRequest {
  province: string;
  city: string;
}

interface ValidationResponse {
  valid: boolean;
  province?: string;
  city?: string;
  message?: string;
  error?: string;
}

interface UseValidateLocationReturn {
  isValidating: boolean;
  validationResult: ValidationResponse | null;
  error: string | null;
  validateLocation: (province: string, city: string) => Promise<ValidationResponse>;
  clearValidation: () => void;
}

export function useValidateLocation(): UseValidateLocationReturn {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateLocation = useCallback(async (province: string, city: string): Promise<ValidationResponse> => {
    // Reset previous state
    setError(null);
    setValidationResult(null);

    // Client-side validation
    if (!province?.trim() || !city?.trim()) {
      const errorResult: ValidationResponse = {
        valid: false,
        error: 'Both province and city are required'
      };
      setValidationResult(errorResult);
      return errorResult;
    }

    setIsValidating(true);

    try {
      const requestBody: ValidationRequest = {
        province: province.trim(),
        city: city.trim()
      };

      const response = await fetchWithAuth(`${CONFIG.apiUrl}/locations/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data: ValidationResponse = await response.json();

      if (!response.ok) {
        // Handle different error scenarios
        if (response.status === 400) {
          if (data.valid === false) {
            // This is a validation error with structured response
            setValidationResult(data);
            return data;
          } else {
            // This is a request format error
            throw new Error(data.error || 'Bad request');
          }
        } else if (response.status === 500) {
          throw new Error(data.error || 'Internal server error');
        } else {
          throw new Error(`Error ${response.status}: Failed to validate location`);
        }
      }

      // Success case
      setValidationResult(data);
      return data;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to validate location';
      setError(errorMessage);
      
      const errorResult: ValidationResponse = {
        valid: false,
        error: errorMessage
      };
      setValidationResult(errorResult);
      console.error('Error validating location:', err);
      return errorResult;
      
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
    setError(null);
  }, []);

  return {
    isValidating,
    validationResult,
    error,
    validateLocation,
    clearValidation,
  };
}