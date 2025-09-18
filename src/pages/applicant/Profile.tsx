import React, { useState, useEffect } from 'react';
import { ApplicantProfile as ApplicantProfileType } from '@/types/applicant.ts';
import WorkExperienceSection from '@/components/applicant/WorkExperienceSection.tsx';
import EducationSection from '@/components/applicant/EducationSection.tsx';
import BasicInfoSection from '@/components/applicant/BasicInfoSection.tsx';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon } from '@heroicons/react/24/solid';
import BackButton from '@/components/other/BackButton.tsx';
import ApplicantCVDropzone from '@/components/applicant/ApplicantCVDropzone.tsx';
import { getApplicantProfile, updateApplicantProfile } from '@/services/applicantService';

export function ApplicantProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ApplicantProfileType>({
    basicInfo: {
      email: user?.email || "",
      fullName: user?.name || "",
      password: "",
    },
    workExperience: [],
    education: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isWorkCollapsed, setIsWorkCollapsed] = useState(true);
  const [isEducationCollapsed, setIsEducationCollapsed] = useState(true);
  
  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getApplicantProfile();
        setProfile(profileData);
        setError(null);
      } catch (err) {
        console.error('Error al cargar el perfil:', err);
        setError('No se pudo cargar el perfil. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

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
    try {
      setLoading(true);
      await updateApplicantProfile(profile);
      setSuccessMessage('Perfil actualizado correctamente');
      setError(null);
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error al actualizar el perfil:', err);
      setError('No se pudo actualizar el perfil. Inténtalo de nuevo más tarde.');
      setSuccessMessage(null);
    } finally {
      setLoading(false);
    }
  };

  // Autocompletar datos desde el CV
  const handleCVProcessed = (cvData: any) => {
  setProfile(prev => ({
      ...prev,
      cvUrl: cvData.cvUrl || prev.cvUrl,
      basicInfo: {
      ...prev.basicInfo,
      fullName: cvData.fullName || prev.basicInfo.fullName,
      email: cvData.email || prev.basicInfo.email,
      },
      workExperience: cvData.workExperience || prev.workExperience,
      education: cvData.education || prev.education,
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
        
        {loading && !profile.basicInfo.email ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <form className="w-full flex flex-col gap-6 mt-4" onSubmit={handleSubmit}>
            {/* Mensajes de error o éxito */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                <p className="text-green-700">{successMessage}</p>
              </div>
            )}
            
            <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} showPassword={false} />
            {/* Adjuntar CV debajo de la información básica */}
            <ApplicantCVDropzone onCVProcessed={handleCVProcessed} />

            {/* Sección colapsable: Experiencia Laboral */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsWorkCollapsed(prev => !prev)}
                className="w-full flex items-center justify-between px-5 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
              >
                <span>Experiencia Laboral</span>
                <span className="text-sm text-blue-600">
                  {isWorkCollapsed ? 'Mostrar' : 'Ocultar'} · {profile.workExperience.length} items
                </span>
              </button>
              {!isWorkCollapsed && (
                <div className="mt-3">
                  <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
                </div>
              )}
            </div>

            {/* Sección colapsable: Educación */}
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setIsEducationCollapsed(prev => !prev)}
                className="w-full flex items-center justify-between px-5 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold hover:bg-blue-100 transition-colors"
              >
                <span>Educación</span>
                <span className="text-sm text-blue-600">
                  {isEducationCollapsed ? 'Mostrar' : 'Ocultar'} · {profile.education.length} items
                </span>
              </button>
              {!isEducationCollapsed && (
                <div className="mt-3">
                  <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
                </div>
              )}
            </div>

            <div className="flex justify-center pt-6 sticky bottom-0 bg-white/50 backdrop-blur-sm py-4 rounded-b-2xl">
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplicantProfile;
