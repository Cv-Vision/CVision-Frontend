import { FC } from "react";

interface FormInputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    name?: string;
}

const FormInput: FC<FormInputProps> = ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    required = false, 
    error,
    name 
}) => {
    return (
        <div className="space-y-2 w-full">
            <label htmlFor={name} className="text-sm font-medium text-foreground">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`h-12 w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                    error 
                        ? "border-red-500 focus:border-red-500" 
                        : "border-border focus:border-teal-500"
                }`}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default FormInput;
