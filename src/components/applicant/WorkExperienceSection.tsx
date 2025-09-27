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
        <div className="space-y-4">
            {data.map((exp, index) => (
                <div key={exp.id} className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-900">Experiencia {index + 1}</h4>
                        <button 
                            onClick={() => onRemove(index)} 
                            className="text-red-600 text-sm font-medium hover:text-red-800 px-3 py-1 rounded-md border border-red-200 hover:border-red-300 transition-colors"
                        >
                            Eliminar
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Empresa" value={exp.company} onChange={(v) => onChange(index, "company", v)} />
                        <FormInput label="Puesto" value={exp.role} onChange={(v) => onChange(index, "role", v)} />
                        <FormInput label="Fecha de inicio" type="date" value={exp.startDate} onChange={(v) => onChange(index, "startDate", v)} />
                        <FormInput label="Fecha de fin" type="date" value={exp.endDate || ""} onChange={(v) => onChange(index, "endDate", v)} />
                    </div>
                    <FormTextArea label="Descripción" value={exp.description || ""} onChange={(v) => onChange(index, "description", v)} />
                </div>
            ))}
            <button 
                onClick={onAdd} 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
                Agregar experiencia
            </button>
        </div>
    );
};

export default WorkExperienceSection;
