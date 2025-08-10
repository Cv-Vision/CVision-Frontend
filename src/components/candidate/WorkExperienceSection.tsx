import { FC } from "react";
import { WorkExperience } from "../../types/candidate.ts";
import FormInput from "./FormInput.tsx";
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
                <div key={exp.id} className="bg-white p-4 rounded-lg shadow flex flex-col gap-3">
                    <FormInput label="Empresa" value={exp.company} onChange={(v) => onChange(index, "company", v)} />
                    <FormInput label="Puesto" value={exp.role} onChange={(v) => onChange(index, "role", v)} />
                    <FormInput label="Fecha de inicio" type="date" value={exp.startDate} onChange={(v) => onChange(index, "startDate", v)} />
                    <FormInput label="Fecha de fin" type="date" value={exp.endDate || ""} onChange={(v) => onChange(index, "endDate", v)} />
                    <FormInput label="Descripción" value={exp.description || ""} onChange={(v) => onChange(index, "description", v)} />
                    <button onClick={() => onRemove(index)} className="text-red-500 text-sm hover:underline">Eliminar</button>
                </div>
            ))}
            <button onClick={onAdd} className="bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Agregar experiencia</button>
        </FormSection>
    );
};

export default WorkExperienceSection;
