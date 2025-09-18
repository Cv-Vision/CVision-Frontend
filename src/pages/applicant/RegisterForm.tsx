import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicantProfile } from "@/types/applicant.ts";
import BasicInfoSection from "@/components/applicant/BasicInfoSection.tsx";
import WorkExperienceSection from "@/components/applicant/WorkExperienceSection.tsx";
import EducationSection from "@/components/applicant/EducationSection.tsx";
import ApplicantCVDropzone from "@/components/applicant/ApplicantCVDropzone.tsx";
import { registerApplicant } from "@/services/applicantService.ts";
import { v4 as uuidv4 } from "uuid";
import { registerUser } from '@/services/registrationService';
import { useToast } from '../../context/ToastContext';

const ApplicantRegisterForm = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<ApplicantProfile>({
        basicInfo: { email: "", password: "", fullName: "", confirmPassword: "" },
        workExperience: [],
        education: [],
        cvUrl: undefined,
        userId: undefined
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFormFields, setShowFormFields] = useState(false);
    const [isWorkCollapsed, setIsWorkCollapsed] = useState(true);
    const [isEducationCollapsed, setIsEducationCollapsed] = useState(true);
    const { showToast } = useToast();

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
            cvUrl: cvData.cvUrl || prev.cvUrl,
            userId: cvData.userId || prev.userId,
            basicInfo: {
                ...prev.basicInfo,
                fullName: cvData.fullName || prev.basicInfo.fullName,
                email: cvData.email || prev.basicInfo.email,
            },
            workExperience: cvData.workExperience || prev.workExperience,
            education: cvData.education || prev.education,
        }));
        
        // Mostrar los campos del formulario después de procesar el CV
        setShowFormFields(true);
        // Colapsar secciones largas por defecto
        setIsWorkCollapsed(true);
        setIsEducationCollapsed(true);
        
        // Mostrar mensaje de éxito
        showToast('Extracción de datos completa, ¡revisa bien tu información!', 'success');
    };

    const handleSubmit = async () => {
        // Validar campos obligatorios
        if (!profile.basicInfo.email || !profile.basicInfo.password || !profile.basicInfo.fullName) {
            showToast('Por favor completa todos los campos obligatorios', 'error');
            return;
        }

        if (profile.basicInfo.password.length < 8) {
            showToast('La contraseña debe tener al menos 8 caracteres', 'error');
            return;
        }

        if (profile.basicInfo.password !== profile.basicInfo.confirmPassword) {
            showToast('Las contraseña no coinciden', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            // Primero le pega a nuestro backend
            await registerUser({ name: profile.basicInfo.fullName, email: profile.basicInfo.email, password: profile.basicInfo.password, role: 'APPLICANT' });
            const result = await registerApplicant(profile);
            showToast('Perfil guardado exitosamente. Revisa tu email para confirmar tu cuenta. ', 'success');
            
            // Redirigir a la página de confirmación después de 5 segundos
            // Pasar tanto el username como el email
            setTimeout(() => {
                navigate(`/applicant-confirm?username=${encodeURIComponent(profile.basicInfo.fullName)}&email=${encodeURIComponent(result.email)}`);
            }, 5000);
            
        } catch (error: any) {
            console.error('Error al guardar perfil:', error);
            showToast(error.message || 'Error al guardar el perfil. Intenta nuevamente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-y-auto">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent text-center mb-4">
                    Crear Perfil de Aplicante
                </h1>
                <p className="text-lg text-gray-600 text-center mb-8">
                    ¡Solo tenés que subir tu CV!
                </p>
                
                {/* Mostrar siempre el componente de subida de CV */}
                <ApplicantCVDropzone onCVProcessed={handleCVProcessed} />
                
                {/* Mostrar el resto de campos solo después de subir el CV */}
                {showFormFields && (
                    <div className="animate-fadeIn">
                        <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} showPassword={true}/>

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
                        
                        {/* Botón de guardar */}
                        <div className="flex justify-center pt-6 sticky bottom-0 bg-white/50 backdrop-blur-sm py-4 rounded-b-2xl">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || profile.basicInfo.password !== profile.basicInfo.confirmPassword}
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
                )}
            </div>
        </div>
    );
};

export default ApplicantRegisterForm;