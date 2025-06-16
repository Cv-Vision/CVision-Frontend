import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BriefcaseIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/solid';
import BackButton from '@/components/BackButton';
import JobDetails from '../../components/JobDetails';
import CandidateList from '../../components/CandidateList';
import { fetchWithAuth } from '../../services/fetchWithAuth';

interface JobData {
  id: string;
  title: string;
  description: string;
  requirements: {
    seniority: 'Junior' | 'Mid' | 'Senior';
    englishLevel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
    contractType: 'Full-time' | 'Part-time' | 'Freelance';
    additionalRequirements?: string;
  };
}

interface Candidate {
  id: string;
  fullName: string;
  score: number;
  cvUrl: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedFeedback: string;
  };
}

type Tab = 'details' | 'candidates';

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobDetails();
    if (activeTab === 'candidates') {
      fetchCandidates();
    }
  }, [jobId, activeTab]);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`/api/recruiter/job/${jobId}`);
      if (!response.ok) {
        throw new Error('Error al cargar los detalles del puesto');
      }
      const data = await response.json();
      setJobData(data);
    } catch (err) {
      // Manejo de error real sin datos mock
      setError(err instanceof Error ? err.message : 'Error al cargar los detalles del puesto');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCandidates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth(`/api/recruiter/job/${jobId}/candidates`);
      if (!response.ok) {
        throw new Error('Error al cargar los candidatos');
      }
      const data = await response.json();
      const sortedCandidates = data.sort((a: Candidate, b: Candidate) => b.score - a.score);
      setCandidates(sortedCandidates);
    } catch (err) {
      // Manejo de error real sin datos mock
      setError(err instanceof Error ? err.message : 'Error al cargar los candidatos');
      setCandidates([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (description: string, requirements: JobData['requirements']) => {
    try {
      const response = await fetchWithAuth(`/api/recruiter/job/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          requirements,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al guardar los cambios');
      }

      setJobData(prev => prev ? {
        ...prev,
        description,
        requirements,
      } : null);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al guardar los cambios');
    }
  };

  if (isLoading && !jobData) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error && !jobData) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No se encontró el puesto</p>
          <button
            onClick={() => navigate('/recruiter/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <BackButton />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BriefcaseIcon className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-800">{jobData.title}</h1>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5" />
                Detalles del Puesto
              </button>
              <button
                onClick={() => setActiveTab('candidates')}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'candidates'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserGroupIcon className="h-5 w-5" />
                Candidatos ({candidates.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === 'details' ? (
              <JobDetails
                jobId={jobId!}
                initialDescription={jobData.description}
                initialRequirements={jobData.requirements}
                onSave={handleSave}
              />
            ) : (
              <CandidateList
                candidates={candidates}
                isLoading={isLoading}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage; 