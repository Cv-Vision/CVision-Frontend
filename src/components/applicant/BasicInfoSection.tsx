import { FC } from "react";
import { BasicInfo } from "@/types/applicant.ts";
import FormInput from "./FormInput.tsx";
import FormSection from "./FormSelection.tsx";

interface Props {
    data: BasicInfo;
    onChange: (field: keyof BasicInfo, value: string) => void;
    showPassword?: boolean;
    errors?: Record<string, string>;
}

const BasicInfoSection: FC<Props> = ({ data, onChange, showPassword = true, errors = {} }) => {
    return (
        <FormSection title="Información Básica">
            <FormInput 
                label="Nombre completo" 
                name="fullName"
                value={data.fullName} 
                onChange={(v) => onChange("fullName", v)} 
                required 
                error={errors.fullName}
            />
            <FormInput 
                label="Correo electrónico" 
                name="email"
                type="email" 
                value={data.email} 
                onChange={(v) => onChange("email", v)} 
                required 
                error={errors.email}
            />
            {showPassword && (
                <>
                    <FormInput 
                        label="Contraseña" 
                        name="password"
                        type="password" 
                        value={data.password} 
                        onChange={(v) => onChange("password", v)} 
                        required 
                        error={errors.password}
                    />
                    <FormInput 
                        label="Confirmar contraseña" 
                        name="confirmPassword"
                        type="password" 
                        value={data.confirmPassword || ""} 
                        onChange={(v) => onChange("confirmPassword", v)} 
                        required 
                        error={errors.confirmPassword}
                    />
                </>
            )}
        </FormSection>
    );
};

export default BasicInfoSection;
