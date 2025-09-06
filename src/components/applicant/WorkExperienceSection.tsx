import { FC } from "react";
import { WorkExperience } from "../../types/applicant.ts";
import FormInput from "./FormInput.tsx";
import FormTextArea from "../applicant/FormTextArea.tsx";
import FormSection from "./FormSelection.tsx";

interface Props {
    data: WorkExperience[];
    onChange: (index: number, field: keyof WorkExperience, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

const WorkExperienceSection: FC<Props> = ({ data, onChange, onAdd, onRemove }) => {
    return (
        <FormSection title="Experiencia Laboral">
            {data.map((exp, index) => (
                <div key={exp.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 flex flex-col gap-4">
                    <FormInput label="Empresa" value={exp.company} onChange={(v) => onChange(index, "company", v)} />
                    <FormInput label="Puesto" value={exp.role} onChange={(v) => onChange(index, "role", v)} />
                    <FormInput label="Fecha de inicio" type="date" value={exp.startDate} onChange={(v) => onChange(index, "startDate", v)} />
                    <FormInput label="Fecha de fin" type="date" value={exp.endDate || ""} onChange={(v) => onChange(index, "endDate", v)} />
                    <FormTextArea label="Descripción" value={exp.description || ""} onChange={(v) => onChange(index, "description", v)} />
                    <div className="flex justify-center">
                        <button 
                            onClick={() => onRemove(index)} 
                            className="text-red-600 text-sm font-semibold hover:text-red-800 px-4 py-2 rounded-xl border-2 border-red-200 hover:border-red-300 transition-all duration-300"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
            <button 
                onClick={onAdd} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:scale-105 hover:from-blue-600 hover:to-indigo-700"
            >
                Agregar experiencia
            </button>
        </FormSection>
    );
};

export default WorkExperienceSection;
