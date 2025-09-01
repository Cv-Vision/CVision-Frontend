// filepath: /home/hilu/projects/austral/lab3/front/CVision-Frontend/src/hooks/usePublicJobSearch.ts
import { useState, useCallback } from 'react';
import { CONFIG } from '@/config';
import { Job } from '@/context/JobContext';
import { JobSearchFilters } from '@/types/applicant';

// Hook to call the public advanced search endpoint: GET /job-postings/search
// It does NOT require authentication.
// Only accepted query params: company, location, experience_level, contract_type, title
// All are optional; partial match for company, location, title.

export function usePublicJobSearch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (filters: Partial<JobSearchFilters>) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      // Map legacy fields to API expected params
      const company = filters.company?.trim();
      const location = filters.location?.trim();
      const experience_level = (filters.experience_level || filters.seniorityLevel)?.trim();
      const contract_type = (filters.contract_type || filters.contractType)?.trim();
      const title = filters.title?.trim();

      if (company) params.append('company', company);
      if (location) params.append('location', location);
      if (experience_level) params.append('experience_level', experience_level);
      if (contract_type) params.append('contract_type', contract_type);
      if (title) params.append('title', title);

      const query = params.toString();
      const url = `${CONFIG.apiUrl}/job-postings/search${query ? `?${query}` : ''}`;

      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error('Parámetros inválidos de búsqueda');
        }
        throw new Error('Error buscando puestos');
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error('Respuesta inesperada del servidor');
      }

      const mapped: Job[] = data.map((item: any) => ({
        pk: item.posting_id, // map posting_id -> pk for existing components
        title: item.title,
        description: item.description,
        company: item.company ?? '',
        questions: [], // las preguntas no se pasan en este search, solo en el de detalle
        status: item.status,
        experience_level: item.experience_level,
        english_level: item.english_level,
        contract_type: item.contract_type,
        location: item.location,
        industry_experience: item.industry_experience?.industries?.length
          ? { required: false, industry: item.industry_experience.industries[0] }
          : undefined,
        additional_requirements: item.additional_requirements ? JSON.stringify(item.additional_requirements) : undefined,
      }));

      setJobs(mapped);
    } catch (e: any) {
      setError('Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { jobs, isLoading, error, search };
}

