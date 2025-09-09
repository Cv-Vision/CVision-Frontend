import { CONFIG } from '@/config';
import { useEffect, useState } from 'react';

export interface Applicant {
  id: string;
  fullName: string;
  score: number | null;
  cvId: string;
  rating?: string;
  status?: string;
  rawReasons: string[];
}

const S3_BASE_URL = `${CONFIG.bucketUrl}`;

export const useGetApplicantsByJobId = (jobId: string) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicants = async (skipLoading = false) => {
    if (!skipLoading) {
      setIsLoading(true);
      setError(null);
    }

    const idToken = sessionStorage.getItem('idToken');
    if (!idToken) {
      setError('No autenticado');
      if (!skipLoading) setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${CONFIG.apiUrl}/job-postings/${jobId}/applicants`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) throw new Error('Error al obtener aplicantes');
      const data = await res.json();
      const mappedApplicants: Applicant[] = (data || []).map((item: any) => ({
        id: item.application_id,
        fullName: item.cv_analysis_result?.analysis_data?.name || '',
        score: item.cv_analysis_result?.analysis_data?.score || null,
        cvId: item.cv_hash,
        cvUrl: item.cv_upload_key ? `${S3_BASE_URL}${item.cv_upload_key}` : '',
        rating: item.valoracion || '',
        status: item.status || '',
        rawReasons: item.cv_analysis_result?.analysis_data?.reasons || [],
      }));
      mappedApplicants.sort((a, b) => {
        if (a.score === null && b.score === null) return 0;
        if (a.score === null) return 1;
        if (b.score === null) return -1;
        return b.score - a.score;
      });
      setApplicants(mappedApplicants);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!skipLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;
    fetchApplicants(); // Solo fetch inicial, sin polling
  }, [jobId]);

  return { applicants, isLoading, error, refetch: fetchApplicants };
};

export const useGetTop3ApplicantsByJobId = (jobId: string) => {
  const [top3Applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicants = async (skipLoading = false) => {
    if (!skipLoading) {
      setIsLoading(true);
      setError(null);
    }

    const idToken = sessionStorage.getItem('idToken');
    if (!idToken) {
      setError('No autenticado');
      if (!skipLoading) setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${CONFIG.apiUrl}/job-postings/${jobId}/metrics/top3`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) throw new Error('Error al obtener aplicantes');
      const data = await res.json();
      const mappedApplicants: Applicant[] = (data || []).map((item: any) => ({
        fullName: item.analysis_data?.name || '',
        score: item.analysis_data?.score || null,
        rating: item.valoracion || '',
        status: item.status || '',
        rawReasons: item.analysis_data?.reasons || [],
      }));
      mappedApplicants.sort((a, b) => {
        if (a.score === null && b.score === null) return 0;
        if (a.score === null) return 1;
        if (b.score === null) return -1;
        return b.score - a.score;
      });
      setApplicants(mappedApplicants);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!skipLoading) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;
    fetchApplicants(); // Solo fetch inicial, sin polling
  }, [jobId]);

  return { top3Applicants, isLoading, error, refetch: fetchApplicants };
};
