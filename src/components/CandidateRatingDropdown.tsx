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

  // 🧭 Posición del dropdown para usar con `fixed`
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  // 🔁 Sync selected cuando cambia el initialValue
  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  const handleSelect = async (option: string) => {
    console.log("📤 Enviando rating al backend:", {
      jobId,
      cvId,
      rating: option
    });

    setSelected(option);
    setIsOpen(false);
    await setRating(jobId, cvId, option);
  };

  // ✅ Mostrar mensaje "Guardado ✓"
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 1000);
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

  // ✅ Calcular posición absoluta cuando se abre el dropdown
  useEffect(() => {
    if (isOpen) {
      const button = document.getElementById(`dropdown-${cvId}`);
      if (button) {
        const rect = button.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
      }
    }
  }, [isOpen]);

  return (
    <div id={`dropdown-${cvId}`} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <span>{selected || 'Seleccionar'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>


      {isOpen && (
        <div
          className="fixed z-50 w-40 max-h-40 overflow-y-auto rounded bg-white border shadow-lg"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left
          }}
        >
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

      {error && (
        <div className="mt-1 px-2 py-1 text-sm bg-red-100 text-red-700 rounded">
          ❌ {error}
        </div>
      )}
      {showSuccess && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50 animate-fade-in-out">
          Guardado ✓
        </div>
      )}

    </div>
  );
};
