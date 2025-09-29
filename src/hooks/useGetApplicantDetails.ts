import { useQuery } from '@tanstack/react-query';
import { CONFIG } from '@/config';
import { fetchWithAuth } from '@/services/fetchWithAuth';
import { GeminiAnalysisResult } from '@/services/geminiAnalysisService';

interface CVAnalysisResult {
  analysis_data: GeminiAnalysisResult;
  analysis_id: string;
  created_at: string;
  job_application_id: string;
  s3_key: string;
  updated_at: string;
}

interface JobPosting {
  additional_requirements: string | null;
  company: string;
  contract_type: string | null;
  created_at: string;
  created_by_user_id: string;
  description: string;
  english_level: string | null;
  experience_level: string | null;
  industry_experience: { required: boolean };
  country: string | null;
  province: string | null;
  city: string | null;
  posting_id: string;
  status: string;
  title: string;
  updated_at: string;
}

export interface ApplicantDetails {
  application_id: string;
  application_source: string;
  created_at: string;
  cv_analysis_result: CVAnalysisResult;
  cv_hash: string;
  cv_upload_key: string;
  job_posting: JobPosting;
  job_posting_id: string;
  status: string;
  updated_at: string;
  user_id: string;
}

const getApplicantDetails = async (jobId: string, applicationId: string): Promise<ApplicantDetails> => {
  const response = await fetchWithAuth(
    `${CONFIG.apiUrl}/job-postings/${jobId}/applicants/${applicationId}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Error fetching applicant details: ${errorData.message || 'Unknown error'}`);
  }

  return response.json();
};

export const useGetApplicantDetails = (jobId: string, applicationId: string, enabled: boolean) => {
  return useQuery<ApplicantDetails, Error>({
    queryKey: ['applicantDetails', jobId, applicationId],
    queryFn: () => getApplicantDetails(jobId, applicationId),
    enabled: enabled && !!jobId && !!applicationId,
  });
};
