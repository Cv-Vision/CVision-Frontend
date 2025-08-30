import { FC } from "react";
import { Education } from "@/types/applicant.ts";
import FormInput from "./FormInput.tsx";
import FormSection from "./FormSelection.tsx";

interface Props {
    data: Education[];
    onChange: (index: number, field: keyof Education, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

const EducationSection: FC<Props> = ({ data, onChange, onAdd, onRemove }) => {
    return (
        <FormSection title="Educación">
            {data.map((edu, index) => (
                <div key={edu.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 flex flex-col gap-4">
                    <FormInput label="Institución" value={edu.institution} onChange={(v) => onChange(index, "institution", v)} />
                    <FormInput label="Título" value={edu.degree} onChange={(v) => onChange(index, "degree", v)} />
                    <FormInput label="Fecha de inicio" type="date" value={edu.startDate} onChange={(v) => onChange(index, "startDate", v)} />
                    <FormInput label="Fecha de fin" type="date" value={edu.endDate || ""} onChange={(v) => onChange(index, "endDate", v)} />
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
                Agregar educación
            </button>
        </FormSection>
    );
};

export default EducationSection;
