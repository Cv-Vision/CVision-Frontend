import { createContext, useContext, useState, ReactNode } from 'react';

export type Job = {
  pk: string;
  title: string;
  description: string;
  company: string;
  status: string;
  experience_level?: string;
  english_level?: string;
  contract_type?: string;
  location?: string;
  industry_experience?: {
    required: boolean;
    industry?: string;
  };
  additional_requirements?: string;
};

export type Application = {
  jobId: string;
  answers: string[];
  candidate: string;
};

type JobContextType = {
  jobs: Job[];
  addJob: (job: Job) => void;
  applications: Application[];
  addApplication: (application: Application) => void;
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]); // Removed default job data

  const [applications, setApplications] = useState<Application[]>([]);

  const addJob = (job: Job) => setJobs((prev) => [...prev, job]);
  const addApplication = (application: Application) => setApplications((prev) => [...prev, application]);

  return (
    <JobContext.Provider value={{ jobs, addJob, applications, addApplication }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) throw new Error('useJobs must be used within a JobProvider');
  return context;
};