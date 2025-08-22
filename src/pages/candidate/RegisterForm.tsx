import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CandidateProfile } from "@/types/candidate.ts";
import BasicInfoSection from "../../components/candidate/BasicInfoSection.tsx";
import WorkExperienceSection from "../../components/candidate/WorkExperienceSection.tsx";
import EducationSection from "../../components/candidate/EducationSection.tsx";
import CandidateCVDropzone from "../../components/candidate/CandidateCVDropzone.tsx";
import Toast from "../../components/other/Toast.tsx";
import { registerCandidate } from "../../services/candidateService.ts";
import { v4 as uuidv4 } from "uuid";

const CandidateRegisterForm = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<CandidateProfile>({
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

    const handleBasicInfoChange = (field: keyof CandidateProfile["basicInfo"], value: string) => {
        setProfile((prev) => ({
            ...prev,
            basicInfo: { ...prev.basicInfo, [field]: value }
        }));
    };

    const handleWorkChange = (index: number, field: keyof CandidateProfile["workExperience"][0], value: string) => {
        setProfile((prev) => {
            const updated = [...prev.workExperience];
            updated[index] = { ...updated[index], [field]: value };
            return { ...prev, workExperience: updated };
        });
    };

    const handleEducationChange = (index: number, field: keyof CandidateProfile["education"][0], value: string) => {
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
            const result = await registerCandidate(profile);
            showToast('success', 'Perfil guardado exitosamente. Revisa tu email para confirmar tu cuenta.');
            
            // Redirigir a la página de confirmación después de 2 segundos
            // Pasar tanto el username como el email
            setTimeout(() => {
                navigate(`/candidate-confirm?username=${encodeURIComponent(result.username)}&email=${encodeURIComponent(result.email)}`);
            }, 2000);
            
        } catch (error: any) {
            console.error('Error al guardar perfil:', error);
            showToast('error', error.message || 'Error al guardar el perfil. Intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col items-center py-10 px-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-8 flex flex-col gap-8">
                <h1 className="text-3xl font-extrabold text-gray-800 text-center">Crear Perfil de Candidato</h1>
                <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} showPassword={true}/>
                {/* Adjuntar CV debajo de la información básica */}
                <CandidateCVDropzone onCVProcessed={handleCVProcessed} />
                <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
                <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg shadow font-semibold text-lg transition ${
                        isSubmitting 
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                            : 'bg-green-500 text-white hover:bg-green-700'
                    }`}
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Perfil'}
                </button>
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

export default CandidateRegisterForm;
