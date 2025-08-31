import { FC } from "react";
import { JobSearchFilters } from "@/types/candidate.ts";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

interface Props {
    filters: JobSearchFilters;
    onChange: (field: keyof JobSearchFilters, value: string) => void;
}

const JobSearchAdvancedFilters: FC<Props> = ({ filters, onChange }) => {
    const experienceLevels = ["JUNIOR", "SEMISENIOR", "SENIOR"]; // backend enums
    const contractTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"]; // backend enums
    // Todo: Agregar filtro de modalidad cuando esté en el backend
    // const modalities = ["Remoto", "Híbrido", "Presencial"]; // deprecated

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-blue-100 w-full flex flex-col gap-6">
            <FormInput label="Empresa" value={filters.company || ""} onChange={(v) => onChange("company", v)} />
            <FormInput label="Ubicación" value={filters.location || ""} onChange={(v) => onChange("location", v)} />
            <FormSelect label="Nivel de experiencia" value={filters.experience_level || filters.seniorityLevel || ""} onChange={(v) => onChange("experience_level", v)} options={experienceLevels} />
            <FormSelect label="Tipo de contrato" value={filters.contract_type || filters.contractType || ""} onChange={(v) => onChange("contract_type", v)} options={contractTypes} />
            {/* TODO: Agregar filtro de modalidad cuando esté en el backend
             <FormSelect label="Modalidad (Deprecado)" value={filters.modality || ""} onChange={(v) => onChange("modality", v)} options={modalities} />

            */}
        </div>
    );
};

export default JobSearchAdvancedFilters;
