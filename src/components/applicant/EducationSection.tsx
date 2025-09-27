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
        <div className="space-y-4">
            {data.map((edu, index) => (
                <div key={edu.id} className="bg-white p-6 rounded-lg border border-gray-200 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-medium text-gray-900">Educación {index + 1}</h4>
                        <button 
                            onClick={() => onRemove(index)} 
                            className="text-red-600 text-sm font-medium hover:text-red-800 px-3 py-1 rounded-md border border-red-200 hover:border-red-300 transition-colors"
                        >
                            Eliminar
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput label="Institución" value={edu.institution} onChange={(v) => onChange(index, "institution", v)} />
                        <FormInput label="Título" value={edu.degree} onChange={(v) => onChange(index, "degree", v)} />
                        <FormInput label="Fecha de inicio" type="date" value={edu.startDate} onChange={(v) => onChange(index, "startDate", v)} />
                        <FormInput label="Fecha de fin" type="date" value={edu.endDate || ""} onChange={(v) => onChange(index, "endDate", v)} />
                    </div>
                </div>
            ))}
            <button 
                onClick={onAdd} 
                className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
                Agregar educación
            </button>
        </div>
    );
};

export default EducationSection;
