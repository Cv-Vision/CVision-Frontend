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
        <div className="flex flex-col gap-1 w-full">
            <label className="text-sm font-semibold text-gray-700">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
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
