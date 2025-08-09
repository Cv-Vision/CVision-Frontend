import { useState } from "react";
import { CandidateProfile } from "@/types/candidate.ts";
import BasicInfoSection from "../../components/candidate/BasicInfoSection.tsx";
import WorkExperienceSection from "../../components/candidate/WorkExperienceSection.tsx";
import EducationSection from "../../components/candidate/EducationSection.tsx";
import { v4 as uuidv4 } from "uuid";
import { signUp } from '@/services/AuthService.ts';
import { useNavigate } from 'react-router-dom';

const CandidateRegisterForm = () => {
    const navigate = useNavigate();
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

    const handleSubmit = async () => {
        const { email, password } = profile.basicInfo;
        const username = profile.basicInfo.fullName || email;
        try {
            await signUp({ username, email, password, userType: 'candidate' });
            navigate('/confirm', { state: { username } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex flex-col items-center py-10 px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl max-w-4xl w-full p-8 border border-white/20 flex flex-col gap-8">
                <h1 className="text-3xl font-extrabold text-gray-800 text-center">Crear perfil de candidato</h1>
                <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} />
                <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
                <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold text-base"
                    >
                        Crear cuenta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateRegisterForm;
