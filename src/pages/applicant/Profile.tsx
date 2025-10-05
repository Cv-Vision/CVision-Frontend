import React, { useState, useEffect } from 'react';
import { ApplicantProfile as ApplicantProfileType } from '@/types/applicant.ts';
import WorkExperienceSection from '@/components/applicant/WorkExperienceSection.tsx';
import EducationSection from '@/components/applicant/EducationSection.tsx';
import BasicInfoSection from '@/components/applicant/BasicInfoSection.tsx';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../context/AuthContext.tsx';
import { UserIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { ArrowLeft } from 'lucide-react';
import ApplicantCVDropzone from '@/components/applicant/ApplicantCVDropzone.tsx';
import { getApplicantProfile, updateApplicantProfile } from '@/services/applicantService';
import { useToast } from '../../context/ToastContext';

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
  const { showToast } = useToast();
  const [isWorkCollapsed, setIsWorkCollapsed] = useState(true);
  const [isEducationCollapsed, setIsEducationCollapsed] = useState(true);
  
  // Cargar datos del perfil al montar el componente
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getApplicantProfile();
        setProfile(profileData);
      } catch (err) {
        console.error('Error al cargar el perfil:', err);
        showToast('No se pudo cargar el perfil. Inténtalo de nuevo más tarde.', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [showToast]);

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
      showToast('Perfil actualizado correctamente', 'success');
    } catch (err) {
      console.error('Error al actualizar el perfil:', err);
      showToast('No se pudo actualizar el perfil. Inténtalo de nuevo más tarde.', 'error');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center px-4 py-2 border border-teal-200 text-teal-700 hover:bg-teal-50 bg-transparent rounded-lg transition-colors"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver 
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Mi Perfil</span>
              <span className="text-gray-500">|</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CV</span>
                </div>
                <span className="text-xl font-bold text-gray-900">CVision</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Profile Header */}
          <div className="border-b p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-teal-100 rounded-xl flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-teal-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
                <p className="text-gray-600">Gestiona tu información personal y profesional</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Perfil activo
                  </span>
                  <span>•</span>
                  <span>{profile.workExperience.length} experiencias</span>
                  <span>•</span>
                  <span>{profile.education.length} estudios</span>
                </div>
              </div>
            </div>
          </div>
        
          {/* Form Content */}
          <div className="p-6">
            {loading && !profile.basicInfo.email ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} showPassword={false} />
                </div>

                {/* CV Upload */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Curriculum Vitae</h3>
                  <ApplicantCVDropzone onCVProcessed={handleCVProcessed} />
                </div>

                {/* Work Experience Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setIsWorkCollapsed(prev => !prev)}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">Experiencia Laboral</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {profile.workExperience.length} items
                      </span>
                    </div>
                    {isWorkCollapsed ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {!isWorkCollapsed && (
                    <div className="mt-4">
                      <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
                    </div>
                  )}
                </div>

                {/* Education Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setIsEducationCollapsed(prev => !prev)}
                    className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">Educación</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {profile.education.length} items
                      </span>
                    </div>
                    {isEducationCollapsed ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {!isEducationCollapsed && (
                    <div className="mt-4">
                      <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
                    </div>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 font-semibold"
                  >
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantProfile;
