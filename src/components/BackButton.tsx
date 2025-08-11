// src/components/BackButton.tsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

type BackButtonProps = {
  to?: string;
};

export default function BackButton({ to }: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => to ? navigate(to) : navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-700 bg-white hover:bg-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 font-medium mb-4 group"
    >
      <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
      <span>Volver</span>
    </button>
  );
}