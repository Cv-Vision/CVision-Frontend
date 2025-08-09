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
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            />
        </div>
    );
};

export default FormInput;
