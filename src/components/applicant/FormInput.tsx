import { FC } from "react";

interface FormInputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
}

const FormInput: FC<FormInputProps> = ({ label, type = "text", value, onChange, placeholder, required = false }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-base font-semibold text-blue-800">
                {label} {required && <span className="text-red-600" title="Obligatorio">*</span>}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg"
            />
        </div>
    );
};

export default FormInput;
