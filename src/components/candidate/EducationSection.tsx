import { FC } from "react";
import { Education } from "../../types/candidate.ts";
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
                    <div key={edu.id} className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-gray-200/50 shadow flex flex-col gap-3">
                <FormInput label="Institución" value={edu.institution} onChange={(v) => onChange(index, "institution", v)} />
    <FormInput label="Título" value={edu.degree} onChange={(v) => onChange(index, "degree", v)} />
    <FormInput label="Fecha de inicio" type="date" value={edu.startDate} onChange={(v) => onChange(index, "startDate", v)} />
    <FormInput label="Fecha de fin" type="date" value={edu.endDate || ""} onChange={(v) => onChange(index, "endDate", v)} />
    <button onClick={() => onRemove(index)} className="self-end text-red-600 text-sm font-medium hover:underline">Eliminar</button>
        </div>
))}
    <button onClick={onAdd} className="self-start bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl shadow hover:shadow-lg transition-all duration-200 font-semibold">Agregar educación</button>
    </FormSection>
);
};

export default EducationSection;
