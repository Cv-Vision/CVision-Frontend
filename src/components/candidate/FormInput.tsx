import { FC } from "react";

interface FormInputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const FormInput: FC<FormInputProps> = ({ label, type = "text", value, onChange, placeholder }) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
            />
        </div>
    );
};

export default FormInput;
