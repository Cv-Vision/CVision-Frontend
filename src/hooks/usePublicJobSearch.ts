import { useState, useCallback } from 'react';
import { CONFIG } from '@/config';
import { Job } from '@/context/JobContext';
import { JobSearchFilters } from '@/types/applicant';
import { fetchWithAuth } from '@/services/fetchWithAuth';

export function usePublicJobSearch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const search = useCallback(
    async (filters: Partial<JobSearchFilters>, page: number = 1, size: number = 10, append = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.company?.trim()) params.append("company", filters.company.trim());
        if (filters.location?.trim()) params.append("location", filters.location.trim());
        if ((filters.experience_level || filters.seniorityLevel)?.trim()) {
          params.append("experience_level", (filters.experience_level || filters.seniorityLevel)!.trim());
        }
        if ((filters.contract_type || filters.contractType)?.trim()) {
          params.append("contract_type", (filters.contract_type || filters.contractType)!.trim());
        }
        if (filters.title?.trim()) params.append("title", filters.title.trim());

        params.append('page', String(page));
        params.append('size', String(size));

        const query = params.toString();
        const url = `${CONFIG.apiUrl}/job-postings/search?${query}`;

        const res = await fetchWithAuth(url, { method: 'GET' });
        if (!res.ok) {
          if (res.status === 400) {
            throw new Error('Parámetros inválidos de búsqueda');
          }
          throw new Error('Error buscando puestos');
        }
        const data = await res.json();

        const mapped: Job[] = data.jobs.map((item: any) => ({
          pk: item.posting_id,
          title: item.title,
          description: item.description,
          company: item.company ?? '',
          questions: [],
          status: item.status,
          experience_level: item.experience_level,
          english_level: item.english_level,
          contract_type: item.contract_type,
          location: item.location,
          industry_experience: item.industry_experience?.industries?.length
            ? { required: false, industry: item.industry_experience.industries[0] }
            : undefined,
          additional_requirements: item.additional_requirements
            ? JSON.stringify(item.additional_requirements)
            : undefined,
          isApplied: item.isApplied
        }));

        setJobs(prev => {
          if (append) {
            if (mapped.length > 0 && prev.find(job => job.pk === mapped[0].pk)) {
              return prev;
            }
            return [...prev, ...mapped];
          }
          return mapped;
        });
        setTotal(data.total);
        setHasMore(page < data.totalPages);
      } catch (e: any) {
        setError('Error desconocido');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { jobs, isLoading, error, hasMore, total, search };
}
