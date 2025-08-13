import React, { useState } from 'react';
import { CandidateProfile as CandidateProfileType } from '@/types/candidate.ts';
import WorkExperienceSection from '../../components/candidate/WorkExperienceSection.tsx';
import EducationSection from '../../components/candidate/EducationSection.tsx';
import BasicInfoSection from '../../components/candidate/BasicInfoSection.tsx';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon } from '@heroicons/react/24/solid';
import BackButton from '@/components/BackButton';

export function CandidateProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateProfileType>({
    basicInfo: {
      email: user?.email || '',
      password: '', // Do not prefill password
      fullName: user?.name || ''
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

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-8 flex flex-col gap-8">
        <div className="w-full flex justify-start mb-4">
          <BackButton />
        </div>
        <UserIcon className="h-12 w-12 text-blue-400 mb-4 self-center" />
        <h1 className="text-3xl font-extrabold text-gray-800 text-center">Editar Perfil de Candidato</h1>
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} />
          <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
          <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition font-semibold text-lg"
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
