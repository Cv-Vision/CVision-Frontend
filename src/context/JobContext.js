import React, { createContext, useContext, useState } from 'react';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const addJob = (job) => {
    setJobs(prev => [...prev, { ...job, id: Date.now() }]);
  };

  const selectJob = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    setSelectedJob(job);
  };

  return (
    <JobContext.Provider value={{ jobs, selectedJob, addJob, selectJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}; 