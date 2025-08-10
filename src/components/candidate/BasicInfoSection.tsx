import { FC } from "react";
import { BasicInfo } from "../../types/candidate.ts";
import FormInput from "./FormInput.tsx";
import FormSection from "./FormSelection.tsx";

interface Props {
    data: BasicInfo;
    onChange: (field: keyof BasicInfo, value: string) => void;
}

const BasicInfoSection: FC<Props> = ({ data, onChange }) => {
    return (
        <FormSection title="Información Básica">
            <FormInput label="Nombre completo" value={data.fullName} onChange={(v) => onChange("fullName", v)} />
            <FormInput label="Correo electrónico" type="email" value={data.email} onChange={(v) => onChange("email", v)} />
            <FormInput label="Contraseña" type="password" value={data.password} onChange={(v) => onChange("password", v)} />
        </FormSection>
    );
};

export default BasicInfoSection;
