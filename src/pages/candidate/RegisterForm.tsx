import { useState } from "react";
import { CandidateProfile } from "@/types/candidate.ts";
import BasicInfoSection from "../../components/candidate/BasicInfoSection.tsx";
import WorkExperienceSection from "../../components/candidate/WorkExperienceSection.tsx";
import EducationSection from "../../components/candidate/EducationSection.tsx";
import { v4 as uuidv4 } from "uuid";

const CandidateRegisterForm = () => {
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

    const handleSubmit = () => {
        console.log("Perfil guardado:", profile);
        // TODO: integrar con backend. Basarse en recruiter/RegisterForm.tsx
    };

    return (
        <div className="min-h-screen bg-blue-100 flex flex-col items-center py-10 px-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-8 flex flex-col gap-8">
                <h1 className="text-3xl font-extrabold text-gray-800 text-center">Crear Perfil de Candidato</h1>
                <BasicInfoSection data={profile.basicInfo} onChange={handleBasicInfoChange} />
                <WorkExperienceSection data={profile.workExperience} onChange={handleWorkChange} onAdd={addWork} onRemove={removeWork} />
                <EducationSection data={profile.education} onChange={handleEducationChange} onAdd={addEducation} onRemove={removeEducation} />
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition font-semibold text-lg"
                >
                    Guardar Perfil
                </button>
            </div>
        </div>
    );
};

export default CandidateRegisterForm;
