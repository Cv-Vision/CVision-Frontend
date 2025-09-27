import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicantProfile } from "@/types/applicant.ts";
import BasicInfoSection from "@/components/applicant/BasicInfoSection.tsx";
import WorkExperienceSection from "@/components/applicant/WorkExperienceSection.tsx";
import EducationSection from "@/components/applicant/EducationSection.tsx";
import ApplicantCVDropzone from "@/components/applicant/ApplicantCVDropzone.tsx";
import SkillsSection from "@/components/applicant/SkillsSection.tsx";
import Collapsible from "@/components/other/Collapsible.tsx";
import AuthLayout from "@/components/other/AuthLayout.tsx";
import { registerApplicant } from "@/services/applicantService.ts";
import { v4 as uuidv4 } from "uuid";
import { registerUser } from '@/services/registrationService';
import { useToast } from '../../context/ToastContext';
import { Link } from "react-router-dom";

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
    const [step, setStep] = useState<"upload" | "verify">("upload");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [skills, setSkills] = useState<string[]>([]);
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
        
        // Actualizar habilidades si vienen del CV
        if (cvData.skills) {
            setSkills(cvData.skills);
        }
        
        // Cambiar al paso de verificación
        setStep("verify");
        
        // Mostrar mensaje de éxito
        showToast('Extracción de datos completa, ¡revisa bien tu información!', 'success');
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!profile.basicInfo.fullName.trim()) {
            newErrors.fullName = "El nombre completo es requerido";
        }

        if (!profile.basicInfo.email.trim()) {
            newErrors.email = "El correo electrónico es requerido";
        } else if (!/\S+@\S+\.\S+/.test(profile.basicInfo.email)) {
            newErrors.email = "El correo electrónico no es válido";
        }

        if (!profile.basicInfo.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (profile.basicInfo.password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        if (!profile.basicInfo.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña";
        } else if (profile.basicInfo.password !== profile.basicInfo.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

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

    if (step === "upload") {
        return (
            <AuthLayout title="Crear Perfil de Aplicante" subtitle="¡Solo tenés que subir tu CV!">
                <div className="space-y-6">
                    <ApplicantCVDropzone onCVProcessed={handleCVProcessed} />

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">O completa tu información manualmente</p>
                        <button
                            type="button"
                            onClick={() => setStep("verify")}
                            className="w-full px-4 py-3 border border-teal-200 text-teal-600 hover:bg-teal-50 hover:border-teal-300 rounded-lg transition-colors"
                        >
                            Completar manualmente
                        </button>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground">
                            ¿Ya tienes cuenta?{" "}
                            <Link to="/auth/login" className="text-teal-600 hover:underline font-medium">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout title="Crear Perfil de Aplicante" subtitle="Verifica y completa tu información">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <BasicInfoSection 
                    data={profile.basicInfo} 
                    onChange={handleBasicInfoChange} 
                    showPassword={true}
                    errors={errors}
                />

                {/* Skills */}
                <SkillsSection 
                    skills={skills} 
                    onSkillsChange={setSkills} 
                />

                {/* Experience */}
                <Collapsible 
                    title="Experiencia Laboral" 
                    subtitle={`Mostrar • ${profile.workExperience.length} items`}
                >
                    <WorkExperienceSection 
                        data={profile.workExperience} 
                        onChange={handleWorkChange} 
                        onAdd={addWork} 
                        onRemove={removeWork} 
                    />
                </Collapsible>

                {/* Education */}
                <Collapsible 
                    title="Educación" 
                    subtitle={`Mostrar • ${profile.education.length} items`}
                >
                    <EducationSection 
                        data={profile.education} 
                        onChange={handleEducationChange} 
                        onAdd={addEducation} 
                        onRemove={removeEducation} 
                    />
                </Collapsible>

                <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-base font-medium h-12 mt-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Guardando perfil..." : "Guardar Perfil"}
                </button>

                <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/auth/login" className="text-teal-600 hover:underline font-medium">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ApplicantRegisterForm;