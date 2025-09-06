import { FC, useEffect, useRef } from "react";

interface FormTextAreaProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    rows?: number;
    minHeight?: number;
}

const FormTextArea: FC<FormTextAreaProps> = ({ 
    label, 
    value, 
    onChange, 
    placeholder, 
    rows = 3,
    minHeight = 100 
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Función para ajustar la altura del textarea
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Guardar la posición de desplazamiento actual
            const scrollPos = window.pageYOffset || document.documentElement.scrollTop;
            
            // Resetear la altura para calcular correctamente el scrollHeight
            textarea.style.height = 'auto';
            
            // Establecer la altura basada en el contenido, con un mínimo
            const newHeight = Math.max(textarea.scrollHeight, minHeight);
            textarea.style.height = `${newHeight}px`;
            
            // Restaurar la posición de desplazamiento para evitar saltos
            window.scrollTo(0, scrollPos);
        }
    };
    
    // Ajustar altura cuando cambia el valor
    useEffect(() => {
        adjustHeight();
    }, [value, minHeight]);
    
    // Manejar el evento de cambio
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        // La altura se ajustará en el useEffect
    };
    
    // Manejar eventos de entrada adicionales que podrían afectar la altura
    const handleInput = () => {
        adjustHeight();
    };
    
    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="text-base font-semibold text-blue-800">{label}</label>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onInput={handleInput}
                placeholder={placeholder}
                rows={rows}
                style={{ minHeight: `${minHeight}px` }}
                className="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-lg resize-none overflow-hidden"
            />
        </div>
    );
};

export default FormTextArea;
