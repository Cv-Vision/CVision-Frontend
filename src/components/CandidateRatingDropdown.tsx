import { useEffect, useState } from 'react';
import { useSetCandidateRating } from '@/hooks/useSetCandidateRating';

type CandidateRatingDropdownProps = {
  jobId: string;
  cvId: string;
  initialValue?: string;
};

const OPTIONS = ['Favorito', 'Visto', 'Bueno', 'Malo'];

export const CandidateRatingDropdown = ({
                                          jobId,
                                          cvId,
                                          initialValue = '',
                                        }: CandidateRatingDropdownProps) => {
  const [selected, setSelected] = useState(initialValue);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { setRating, isLoading, error, success } = useSetCandidateRating();

  const handleSelect = async (option: string) => {
    console.log("📤 Enviando rating al backend:", {
      jobId,
      cvId,
      valoracion: option
    });

    setSelected(option);
    setIsOpen(false);
    await setRating(jobId, cvId, option);
  };


  // ✅ Ocultar mensaje de "Guardado ✓" luego de 500ms
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // ✅ Cerrar dropdown si clickeás afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`#dropdown-${cvId}`)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, cvId]);

  return (
    <div id={`dropdown-${cvId}`} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 border rounded shadow bg-white hover:bg-gray-100"
      >
        {selected || 'Valoración ▾'}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-40 rounded bg-white border shadow-lg">
          {OPTIONS.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={isLoading}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-200 ${
                selected === option ? 'font-semibold bg-gray-100' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">Error: {error}</p>}
      {showSuccess && (
        <p className="text-green-500 text-sm mt-1">Guardado ✓</p>
      )}
    </div>
  );
};
