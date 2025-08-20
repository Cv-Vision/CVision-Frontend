import React, { useState } from 'react';
import { CandidateProfile as CandidateProfileType } from '@/types/candidate.ts';
import WorkExperienceSection from '../../components/candidate/WorkExperienceSection.tsx';
import EducationSection from '../../components/candidate/EducationSection.tsx';
import BasicInfoSection from '../../components/candidate/BasicInfoSection.tsx';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon } from '@heroicons/react/24/solid';
import BackButton from '@/components/other/BackButton.tsx';
import CandidateCVDropzone from '../../components/candidate/CandidateCVDropzone.tsx';

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
    // TODO: Call backend API to update candidate profile
    // Example:
    // await CandidateService.updateProfile(profile);
    console.log('Perfil actualizado:', profile);
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
        <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
          <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} />
          {/* Adjuntar CV debajo de la información básica */}
          <CandidateCVDropzone onCVProcessed={handleCVProcessed} />
          <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
          <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-2 hover:scale-105"
          >
            Guardar Cambios
          </button>
        </form>
        {/* TODO: Show success/error messages from backend response here */}
      </div>
    </div>
  );
}

export default CandidateProfile;
