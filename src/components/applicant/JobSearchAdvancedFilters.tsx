import { FC } from "react";
import { JobSearchFilters } from "@/types/applicant.ts";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

interface Props {
    filters: JobSearchFilters;
    onChange: (field: keyof JobSearchFilters, value: string) => void;
}

const JobSearchAdvancedFilters: FC<Props> = ({ filters, onChange }) => {
    // Estos arrays se reemplazarán con datos reales de la DB
    const jobTypes = ["Tiempo completo", "Medio tiempo", "Freelance"];
    const regions = ["LatAm", "Europa", "Remoto"];
    const contractTypes = ["Indefinido", "Temporal", "Contrato"];
    const seniorityLevels = ["Junior", "Semi-Senior", "Senior"];
    const industries = ["Tecnología", "Salud", "Educación"];
    const modalities = ["Remoto", "Híbrido", "Presencial"];

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-blue-100 w-full flex flex-col gap-6">
            <FormInput label="Empresa" value={filters.company || ""} onChange={(v) => onChange("company", v)} />
            <FormSelect label="Tipo de puesto" value={filters.jobType || ""} onChange={(v) => onChange("jobType", v)} options={jobTypes} />
            <FormSelect label="Región" value={filters.region || ""} onChange={(v) => onChange("region", v)} options={regions} />
            <FormSelect label="Tipo de contrato" value={filters.contractType || ""} onChange={(v) => onChange("contractType", v)} options={contractTypes} placeholder="Opcional" />
            <FormSelect label="Nivel de seniority" value={filters.seniorityLevel || ""} onChange={(v) => onChange("seniorityLevel", v)} options={seniorityLevels} />
            <FormSelect label="Industria" value={filters.industry || ""} onChange={(v) => onChange("industry", v)} options={industries} placeholder="Opcional" />
            <FormSelect label="Modalidad" value={filters.modality || ""} onChange={(v) => onChange("modality", v)} options={modalities} />
        </div>
    );
};

export default JobSearchAdvancedFilters;
