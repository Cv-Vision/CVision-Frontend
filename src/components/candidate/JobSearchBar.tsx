import { FC } from "react";
import FormInput from "./FormInput";

interface Props {
    title: string;
    onTitleChange: (value: string) => void;
    onToggleAdvanced: () => void;
}

const JobSearchBar: FC<Props> = ({ title, onTitleChange, onToggleAdvanced }) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row gap-4 w-full">
            <FormInput
                label="Nombre de puesto"
                value={title}
                onChange={onTitleChange}
                placeholder="Ej: Desarrollador Frontend"
            />
            <div className="flex items-end gap-4">
                <button
                    onClick={onToggleAdvanced}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                    Búsqueda Avanzada
                </button>
            </div>
        </div>
    );
};

export default JobSearchBar;
