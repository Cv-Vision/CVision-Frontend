import { createContext, useContext, useState, ReactNode } from 'react';

export type Job = {
  id: string;
  title: string;
  description: string;
  company: string;
  questions: string[];
  status: number;
};

export type Application = {
  jobId: string;
  answers: string[];
  candidate: string; // mock: nombre o id del candidato
};

type JobContextType = {
  jobs: Job[];
  addJob: (job: Job) => void;
  applications: Application[];
  addApplication: (application: Application) => void;
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'thisIsAMockId',
      title: 'Frontend Developer',
      description: 'React, TypeScript, Tailwind',
      company: 'TechCorp',
      questions: [
        '¿Por qué quieres trabajar en TechCorp?',
        '¿Qué experiencia tienes con React?',
        '¿Cómo resolverías un conflicto en un equipo de desarrollo?'
      ],
      status: 1
    },
    {
      id: 'thisIsAMockId2',
      title: 'Backend Developer',
      description: 'Node.js, Express, MongoDB',
      company: 'DataSoft',
      questions: [
        '¿Qué te motiva a trabajar en DataSoft?',
        '¿Cómo optimizarías una API REST?',
        '¿Qué experiencia tienes con bases de datos NoSQL?'
      ],
      status: 1
    }
  ]);

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