import { FC } from "react";
import FormInput from "./FormInput";

interface Props {
    title: string;
    onTitleChange: (value: string) => void;
    onToggleAdvanced: () => void;
}

const JobSearchBar: FC<Props> = ({ title, onTitleChange, onToggleAdvanced }) => {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-blue-100 flex flex-col md:flex-row gap-6 w-full">
            <FormInput
                label="Nombre de puesto"
                value={title}
                onChange={onTitleChange}
                placeholder="Ej: Desarrollador Frontend"
            />
            <div className="flex items-end gap-4">
                <button
                    onClick={onToggleAdvanced}
                    className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 px-6 py-3 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all duration-300 font-semibold border-2 border-blue-200 hover:border-blue-300"
                >
                    Búsqueda Avanzada
                </button>
            </div>
        </div>
    );
};

export default JobSearchBar;
