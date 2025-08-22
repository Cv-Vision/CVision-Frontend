import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CandidateProfile } from "@/types/candidate.ts";
import { signUp } from "@/services/AuthService.ts";
import BasicInfoSection from "../../components/candidate/BasicInfoSection.tsx";
import WorkExperienceSection from "../../components/candidate/WorkExperienceSection.tsx";
import EducationSection from "../../components/candidate/EducationSection.tsx";
import CandidateCVDropzone from "../../components/candidate/CandidateCVDropzone.tsx";
import { v4 as uuidv4 } from "uuid";

const CandidateRegisterForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState<CandidateProfile>({
        basicInfo: { email: "", password: "", fullName: "" },
        workExperience: [],
        education: []
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
            basicInfo: {
                ...prev.basicInfo,
                fullName: cvData.fullName || prev.basicInfo.fullName,
                // Puedes agregar otros campos si el backend los provee
            },
            workExperience: cvData.workExperience || prev.workExperience,
            education: cvData.education || prev.education,
        }));
    };

    const isValidUsername = (username: string) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/; // Letras, números y guiones bajos, 3-20 caracteres
        return usernameRegex.test(username);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const username = profile.basicInfo.fullName.toLowerCase().replace(/\s+/g, '_') || 'candidate_' + Date.now();

        if (!isValidUsername(username)) {
            setError('El nombre de usuario solo puede contener letras, números y guiones bajos. De 3 a 20 caracteres.');
            setLoading(false);
            return;
        }

        if (!profile.basicInfo.email || !profile.basicInfo.password) {
            setError('Por favor completa todos los campos requeridos.');
            setLoading(false);
            return;
        }

        try {
            await signUp({ 
                username, 
                email: profile.basicInfo.email, 
                password: profile.basicInfo.password, 
                userType: 'candidate' 
            });
            navigate('/confirm', { state: { username } });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col items-center py-10 px-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-8 flex flex-col gap-8">
                <h1 className="text-3xl font-extrabold text-gray-800 text-center">Crear Perfil de Candidato</h1>
                <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} showPassword={true}/>
                {/* Adjuntar CV debajo de la información básica */}
                <CandidateCVDropzone onCVProcessed={handleCVProcessed} />
                <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
                <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
                
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}
                
                <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Registrando...
                        </div>
                    ) : (
                        'Crear Cuenta'
                    )}
                </button>
            </form>
        </div>
    );
};

export default CandidateRegisterForm;
