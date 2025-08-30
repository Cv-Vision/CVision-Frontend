import React, { useState } from 'react';
import { ApplicantProfile as ApplicantProfileType } from '@/types/applicant.ts';
import WorkExperienceSection from '@/components/applicant/WorkExperienceSection.tsx';
import EducationSection from '@/components/applicant/EducationSection.tsx';
import BasicInfoSection from '@/components/applicant/BasicInfoSection.tsx';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon } from '@heroicons/react/24/solid';
import BackButton from '@/components/other/BackButton.tsx';
import ApplicantCVDropzone from '@/components/applicant/ApplicantCVDropzone.tsx';

export function ApplicantProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ApplicantProfileType>({
    basicInfo: {
      email: user?.email || "",
      fullName: user?.name || "",
      password: "",
    },
    workExperience: user?.workExperience || [],
    education: user?.education || []
  });

  const handleWorkChange = (index: number, field: keyof ApplicantProfileType['workExperience'][0], value: string) => {
    setProfile(prev => {
      const updated = [...prev.workExperience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workExperience: updated };
    });
  };

  const handleEducationChange = (index: number, field: keyof ApplicantProfileType['education'][0], value: string) => {
    setProfile(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };
  const handleBasicInfoChange = (field: keyof ApplicantProfileType['basicInfo'], value: string) => {
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
    // TODO: Call backend API to update applicant profile
    // Example:
    // await CandidateService.updateProfile(profile);
    console.log('Perfil actualizado:', profile);
  };

  // Autocompletar datos desde el CV
  const handleCVProcessed = (cvData: unknown) => {
    setProfile(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        fullName: (cvData as { fullName?: string }).fullName || prev.basicInfo.fullName,
        // Puedes agregar otros campos si el backend los provee
      },
      workExperience: (cvData as { workExperience?: any[] }).workExperience || prev.workExperience,
      education: (cvData as { education?: any[] }).education || prev.education,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
        <div className="w-full flex justify-start mb-6">
          <BackButton />
        </div>
        
        {/* Icono y tag centrados */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <UserIcon className="h-16 w-16 text-blue-600" />
          </div>
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
            Aplicante
          </span>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center mb-8">
          Perfil de Aplicante
        </h1>
        
        <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
          <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} />
          {/* Adjuntar CV debajo de la información básica */}
          <ApplicantCVDropzone onCVProcessed={handleCVProcessed} />
          <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
          <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-2 hover:scale-105"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
        {/* TODO: Show success/error messages from backend response here */}
      </div>
    </div>
  );
}

export default ApplicantProfile;
