import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicantProfile } from "@/types/applicant.ts";
import BasicInfoSection from "@/components/applicant/BasicInfoSection.tsx";
import WorkExperienceSection from "@/components/applicant/WorkExperienceSection.tsx";
import EducationSection from "@/components/applicant/EducationSection.tsx";
import ApplicantCVDropzone from "@/components/applicant/ApplicantCVDropzone.tsx";
import Toast from "../../components/other/Toast.tsx";
import { registerApplicant } from "../../services/applicantService.ts";
import { v4 as uuidv4 } from "uuid";

const ApplicantRegisterForm = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ApplicantProfile>({
        basicInfo: { email: "", password: "", fullName: "" },
        workExperience: [],
        education: [],
        cvUrl: undefined
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{
        isVisible: boolean;
        type: 'success' | 'error';
        message: string;
    }>({
        isVisible: false,
        type: 'success',
        message: ''
    });

    const handleBasicInfoChange = (field: keyof ApplicantProfile["basicInfo"], value: string) => {
        setProfile((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, [field]: value }
        }));
    };

    const handleWorkChange = (index: number, field: keyof ApplicantProfile["workExperience"][0], value: string) => {
        setProfile((prev) => {
            const updated = [...prev.workExperience];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, workExperience: updated };
        });
    };

    const handleEducationChange = (index: number, field: keyof ApplicantProfile["education"][0], value: string) => {
        setProfile((prev) => {
            const updated = [...prev.education];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, education: updated };
        });
    };

    const addWork = () => {
        setProfile((prev) => ({
            ...prev,
            workExperience: [...prev.workExperience, { id: uuidv4(), company: "", role: "", startDate: "", description: "" }]
        }));
    };

    const removeWork = (index: number) => {
        setProfile((prev) => ({
            ...prev,
            workExperience: prev.workExperience.filter((_, i) => i !== index)
        }));
    };

    const addEducation = () => {
        setProfile((prev) => ({
            ...prev,
            education: [...prev.education, { id: uuidv4(), institution: "", degree: "", startDate: "" }]
        }));
    };

    const removeEducation = (index: number) => {
        setProfile((prev) => ({
            ...prev,
            education: prev.education.filter((_, i) => i !== index)
        }));
    };

    const handleCVProcessed = (cvData: any) => {
        setProfile(prev => ({
            ...prev,
            cvUrl: cvData.cvUrl || undefined,
            basicInfo: {
                ...prev.basicInfo,
                fullName: cvData.fullName || prev.basicInfo.fullName,
            },
            workExperience: cvData.workExperience || prev.workExperience,
            education: cvData.education || prev.education,
        }));
    };

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({
            isVisible: true,
            type,
            message
        });
    };

    const handleSubmit = async () => {
        // Validar campos obligatorios
        if (!profile.basicInfo.email || !profile.basicInfo.password || !profile.basicInfo.fullName) {
            showToast('error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        if (profile.basicInfo.password.length < 8) {
            showToast('error', 'La contraseña debe tener al menos 8 caracteres');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await registerApplicant(profile);
            showToast('success', 'Perfil guardado exitosamente. Revisa tu email para confirmar tu cuenta.');
            
            // Redirigir a la página de confirmación después de 2 segundos
            // Pasar tanto el username como el email
            setTimeout(() => {
                navigate(`/applicant-confirm?username=${encodeURIComponent(result.username)}&email=${encodeURIComponent(result.email)}`);
            }, 2000);
            
        } catch (error: any) {
            console.error('Error al guardar perfil:', error);
            showToast('error', error.message || 'Error al guardar el perfil. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center mb-8">
                    Crear Perfil de Aplicante
                </h1>
                <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} showPassword={true}/>
                {/* Adjuntar CV debajo de la información básica */}
                <ApplicantCVDropzone onCVProcessed={handleCVProcessed} />
                <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
                <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
                
                {/* <-- Aquí centré el botón (justify-center en lugar de justify-end) --> */}
                <div className="flex justify-center pt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                            isSubmitting 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                        }`}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Perfil'}
                    </button>
                </div>
            </div>
            
            <Toast
                type={toast.type}
                message={toast.message}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};

export default ApplicantRegisterForm;
