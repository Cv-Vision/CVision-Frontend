import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon, CheckIcon } from '@heroicons/react/24/outline';
import BackButton from '@/components/BackButton';
import BasicInfoSection from '@/components/candidate/BasicInfoSection';
import EducationSection from '@/components/candidate/EducationSection';
import WorkExperienceSection from '@/components/candidate/WorkExperienceSection';
import { CandidateProfile as CandidateProfileType, Education, WorkExperience } from '../../types/candidate.ts';

// interface CVHistory {
//   id: string;
//   date: string;
//   status: 'pending' | 'analyzed' | 'error';
//   matches: number;
// }

export function CandidateProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CandidateProfileType>({
    basicInfo: { fullName: user?.name || '', email: user?.email || '', password: '' },
    education: [],
    workExperience: [],
  });
  const handleBasicInfoChange = (field: keyof CandidateProfileType['basicInfo'], value: string) => {
    setProfile(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, [field]: value } }));
  };
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setProfile(prev => {
      const newEd = [...prev.education]; newEd[index] = { ...newEd[index], [field]: value };
      return { ...prev, education: newEd };
    });
  };
  const handleEducationAdd = () => {
    setProfile(prev => ({ ...prev, education: [...prev.education, { id: crypto.randomUUID(), institution: '', degree: '', startDate: '', endDate: '' }] }));
  };
  const handleEducationRemove = (index: number) => {
    setProfile(prev => { const newEd = [...prev.education]; newEd.splice(index, 1); return { ...prev, education: newEd }; });
  };
  const handleWorkExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
    setProfile(prev => {
      const newW = [...prev.workExperience]; newW[index] = { ...newW[index], [field]: value };
      return { ...prev, workExperience: newW };
    });
  };
  const handleWorkExperienceAdd = () => {
    setProfile(prev => ({ ...prev, workExperience: [...prev.workExperience, { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', description: '' }] }));
  };
  const handleWorkExperienceRemove = (index: number) => {
    setProfile(prev => { const newW = [...prev.workExperience]; newW.splice(index, 1); return { ...prev, workExperience: newW }; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // lógica para guardar perfil
    console.log('Perfil de candidato guardado:', profile);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 flex flex-col items-center justify-center py-10 px-2 overflow-hidden">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 flex flex-col items-center">
        <div className="w-full flex justify-start mb-6">
          <BackButton />
        </div>
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <UserIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center">
            Mi Perfil
          </h1>
          <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Candidato
          </span>
        </div>
        <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
      <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} />
      <EducationSection
        data={profile.education}
        onChange={handleEducationChange}
        onAdd={handleEducationAdd}
        onRemove={handleEducationRemove}
      />
      <WorkExperienceSection
        data={profile.workExperience}
        onChange={handleWorkExperienceChange}
        onAdd={handleWorkExperienceAdd}
        onRemove={handleWorkExperienceRemove}
      />
      {/* TODO: Integrar sección para subir CV (confirmar con Albano) */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-2 hover:scale-105"
      >
        <CheckIcon className="h-5 w-5" />
        Guardar cambios
      </button>
    </form>
      </div>
    </div>
  );
}