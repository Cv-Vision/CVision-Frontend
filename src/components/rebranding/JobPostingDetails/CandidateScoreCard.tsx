import React from "react";
import {
  EyeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

interface CandidateScoreCardProps {
  name: string;
  email: string;
  experience: string;
  score: number;
  status: "Revisado" | "Bueno" | "Malo" | "Sin revisar";
  onDownloadCV: () => void;
  onContact: () => void;
}

// Helper para colores de estado
const statusStyles: Record<string, string> = {
  Revisado: "bg-blue-100 text-blue-700",
  Bueno: "bg-green-100 text-green-700",
  Malo: "bg-red-100 text-red-700",
  "Sin revisar": "bg-gray-100 text-gray-700",
};

export const CandidateScoreCard: React.FC<CandidateScoreCardProps> = ({
  name,
  email,
  experience,
  score,
  status,
  onDownloadCV,
  onContact,
}) => {
  // Iniciales para avatar
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white border rounded-xl shadow-sm p-4 flex items-center justify-between hover:shadow-md transition">
      {/* Left side: avatar + info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold">
          {initials}
        </div>

        {/* Candidate info */}
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-sm text-gray-500">{experience}</p>
        </div>
      </div>

      {/* Middle: score + status */}
      <div className="flex items-center gap-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{score}</p>
          <p className="text-sm text-gray-500">Puntuación</p>
        </div>
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${statusStyles[status]}`}
        >
          <EyeIcon className="w-4 h-4" />
          {status}
        </span>
      </div>

      {/* Right side: actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onDownloadCV}
          className="flex items-center gap-1 border rounded-md px-3 py-1 text-sm hover:bg-gray-50"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          CV
        </button>
        <button
          onClick={onContact}
          className="flex items-center gap-1 border rounded-md px-3 py-1 text-sm hover:bg-gray-50"
        >
          <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
          Contactar
        </button>
      </div>
    </div>
  );
};
