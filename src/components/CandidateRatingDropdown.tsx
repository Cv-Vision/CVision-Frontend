import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useSetCandidateRating } from '@/hooks/useSetCandidateRating';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{top: number, left: number, width: number}>({top: 0, left: 0, width: 0});

  useEffect(() => {
    setSelected(initialValue);
  }, [initialValue]);

  const openMenu = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    }
    setIsOpen(true);
  };

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      openMenu();
    }
  };

  const handleSelect = async (option: string) => {
    console.log('🔄 Seleccionando opción:', option);
    setSelected(option);
    setIsOpen(false);
    await setRating(jobId, cvId, option);
  };

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Cerrar el dropdown si se hace click fuera
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const isClickInsideButton = buttonRef.current?.contains(target);
      const isClickInsideMenu = menuRef.current?.contains(target);
      
      if (!isClickInsideButton && !isClickInsideMenu) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleMenu}
        className="flex items-center gap-1 text-sm text-gray-700 hover:text-blue-700 focus:outline-none font-medium px-3 py-2 rounded-lg border border-blue-200 bg-white/70 shadow-sm"
      >
        <span>{selected || 'Seleccionar'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && ReactDOM.createPortal(
        <div
          ref={menuRef}
          className="rounded-xl border border-blue-200 bg-white shadow-xl ring-1 ring-black/5 z-[9999] animate-fade-in-out"
          style={{
            position: 'absolute',
            top: menuPosition.top,
            left: menuPosition.left,
            minWidth: menuPosition.width,
            width: 176 // w-44
          }}
        >
          {OPTIONS.map((option) => (
            <button
              key={option}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
              disabled={isLoading}
              className={`block w-full text-left px-5 py-2 rounded-xl transition-all duration-150
                ${
                  selected === option
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'hover:bg-blue-100 text-gray-700'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>,
        document.body
      )}
      {error && (
        <div className="mt-1 px-2 py-1 text-sm bg-red-100 text-red-700 rounded">
          ❌ {error}
        </div>
      )}
      {showSuccess && ReactDOM.createPortal(
        <div className="fixed top-5 right-5 z-[10000] animate-fade-in-out">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 min-w-80 border border-green-400">
            <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-green-100" />
            <span className="flex-1 font-medium">Valoración guardada correctamente</span>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
