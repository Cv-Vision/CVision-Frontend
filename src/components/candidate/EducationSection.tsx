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
                    <div key={edu.id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-3">
                <FormInput label="Institución" value={edu.institution} onChange={(v) => onChange(index, "institution", v)} />
    <FormInput label="Título" value={edu.degree} onChange={(v) => onChange(index, "degree", v)} />
    <FormInput label="Fecha de inicio" type="date" value={edu.startDate} onChange={(v) => onChange(index, "startDate", v)} />
    <FormInput label="Fecha de fin" type="date" value={edu.endDate || ""} onChange={(v) => onChange(index, "endDate", v)} />
    <button onClick={() => onRemove(index)} className="text-red-500 text-sm hover:underline">Eliminar</button>
        </div>
))}
    <button onClick={onAdd} className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Agregar educación</button>
    </FormSection>
);
};

export default EducationSection;
