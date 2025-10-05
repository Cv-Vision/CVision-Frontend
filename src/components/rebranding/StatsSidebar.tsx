import React, { useState } from "react";
import { StatisticCard } from "./StatisticCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface Stat {
  title: string;
  value: number | string;
  trend: string;
  icon?: React.ReactNode;
}

interface StatsSidebarProps {
  stats: Stat[];
}

export const StatsSidebar: React.FC<StatsSidebarProps> = ({ stats }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`transition-all duration-300 ${
        isOpen ? "w-72" : "w-12"
      } bg-gray-50 h-screen border-r flex flex-col`}
    >
      {/* Header con botón de toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        {isOpen && <h2 className="text-lg font-semibold">Estadísticas</h2>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md hover:bg-gray-200"
        >
          {isOpen ? (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Contenido */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {stats.map((stat, i) => (
            <StatisticCard
              key={i}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))}
        </div>
      )}
    </aside>
  );
};
