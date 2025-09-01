import { FC } from "react";

interface FormSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
}

const FormSelect: FC<FormSelectProps> = ({ label, value, onChange, options, placeholder }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-base font-semibold text-blue-800">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg"
            >
                <option value="">{placeholder || "Selecciona una opción"}</option>
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
};

export default FormSelect;
