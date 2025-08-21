import React, { useState, useEffect } from 'react';
import { CandidateProfile as CandidateProfileType } from '@/types/candidate.ts';
import WorkExperienceSection from '../../components/candidate/WorkExperienceSection.tsx';
import EducationSection from '../../components/candidate/EducationSection.tsx';
import BasicInfoSection from '../../components/candidate/BasicInfoSection.tsx';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import BackButton from '@/components/other/BackButton.tsx';
import CandidateCVDropzone from '../../components/candidate/CandidateCVDropzone.tsx';
import { updateProfile } from '@/services/candidateService';

export function CandidateProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateProfileType>({
    basicInfo: {
      email: user?.email || "",
      fullName: user?.name || "",
      password: "",
    },
    workExperience: user?.workExperience || [],
    education: user?.education || []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<string | null>(null);

  // Reset status messages when form changes
  useEffect(() => {
    if (error || success) {
      setError(null);
      setSuccess(null);
    }
  }, [profile, cvFile]);

  const handleWorkChange = (index: number, field: keyof CandidateProfileType['workExperience'][0], value: string) => {
    setProfile(prev => {
      const updated = [...prev.workExperience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workExperience: updated };
    });
  };

  const handleEducationChange = (index: number, field: keyof CandidateProfileType['education'][0], value: string) => {
    setProfile(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };
  
  const handleBasicInfoChange = (field: keyof CandidateProfileType['basicInfo'], value: string) => {
    setProfile(prev => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [field]: value }
    }));
  };

  const addWork = () => {
    setProfile(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, { id: uuidv4(), company: '', role: '', startDate: '', description: '' }]
    }));
  };

  const removeWork = (index: number) => {
    setProfile(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { id: uuidv4(), institution: '', degree: '', startDate: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateProfile(profile, cvFile || undefined);
      setSuccess(result.message || 'Perfil actualizado con éxito');
      
      // Update user context if needed
      if (result.user) {
        // The auth context could be updated here if needed
        console.log('Usuario actualizado:', result.user);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  // Autocompletar datos desde el CV
  const handleCVProcessed = (cvData: any) => {
    setProfile(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        fullName: cvData.fullName || prev.basicInfo.fullName,
        // Puedes agregar otros campos si el backend los provee
      },
      workExperience: cvData.workExperience || prev.workExperience,
      education: cvData.education || prev.education,
    }));
  };
  
  // Handle CV file upload
  const handleFileUpload = (base64File: string) => {
    setCvFile(base64File);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center py-10 px-2 overflow-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-w-2xl w-full p-10 flex flex-col items-center">
        <div className="w-full flex justify-start mb-6">
          <BackButton />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <UserIcon className="h-12 w-12 text-blue-600" />
          </div>
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Candidato
          </span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center mb-8">
          Editar Perfil de Candidato
        </h1>
        
        {/* Status messages */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start mb-4">
            <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="w-full bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start mb-4">
            <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <p>{success}</p>
          </div>
        )}
        
        <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
          <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} />
          {/* Adjuntar CV debajo de la información básica */}
          <CandidateCVDropzone onCVProcessed={handleCVProcessed} onFileUpload={handleFileUpload} />
          <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
          <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CandidateProfile;
