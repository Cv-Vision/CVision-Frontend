import { FC } from "react";
import { BasicInfo } from "@/types/applicant.ts";
import FormInput from "./FormInput.tsx";
import FormSection from "./FormSelection.tsx";

interface Props {
    data: BasicInfo;
    onChange: (field: keyof BasicInfo, value: string) => void;
    showPassword?: boolean;
}

const BasicInfoSection: FC<Props> = ({ data, onChange, showPassword = true }) => {
    return (
        <FormSection title="Información Básica">
            <FormInput label="Nombre completo" value={data.fullName} onChange={(v) => onChange("fullName", v)} required />
            <FormInput label="Correo electrónico" type="email" value={data.email} onChange={(v) => onChange("email", v)} required />
            {showPassword && (
                <>
                    <FormInput label="Contraseña" type="password" value={data.password} onChange={(v) => onChange("password", v)} required />
                    <FormInput label="Confirmar contraseña" type="password" value={data.confirmPassword || ""} onChange={(v) => onChange("confirmPassword", v)} required />
                </>
            )}
        </FormSection>
    );
};

export default BasicInfoSection;
