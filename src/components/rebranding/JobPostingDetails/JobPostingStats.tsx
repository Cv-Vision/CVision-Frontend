import React from "react";

interface JobPostingStatsProps {
  totalAnalyzed: number;
  avgScore: number;
  highestScore: { value: number; name: string };
  lowestScore: { value: number; name: string };
}

export const JobPostingStats: React.FC<JobPostingStatsProps> = ({
  totalAnalyzed,
  avgScore,
  highestScore,
  lowestScore,
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 grid grid-cols-4 text-center">
      {/* Total Analizados */}
      <div>
        <p className="text-2xl font-bold text-purple-600">{totalAnalyzed}</p>
        <p className="text-sm text-gray-500">Total Analizados</p>
      </div>

      {/* Puntaje Promedio */}
      <div>
        <p className="text-2xl font-bold text-purple-600">{avgScore}</p>
        <p className="text-sm text-gray-500">Puntaje Promedio</p>
      </div>

      {/* Puntaje Más Alto */}
      <div>
        <p className="text-2xl font-bold text-green-600">{highestScore.value}</p>
        <p className="text-sm text-gray-500">Puntaje Más Alto</p>
        <p className="text-sm text-green-600 font-medium">{highestScore.name}</p>
      </div>

      {/* Puntaje Más Bajo */}
      <div>
        <p className="text-2xl font-bold text-red-600">{lowestScore.value}</p>
        <p className="text-sm text-gray-500">Puntaje Más Bajo</p>
        <p className="text-sm text-red-600 font-medium">{lowestScore.name}</p>
      </div>
    </div>
  );
};
