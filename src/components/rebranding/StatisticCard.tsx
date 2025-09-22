import React from "react";

interface StatisticCardProps {
  title: string;
  value: number | string;
  trend: string;
  icon?: React.ReactNode;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, trend, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-between min-w-[200px]">
      <div className="flex justify-between items-start">
        <p className="text-gray-600 text-sm">{title}</p>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{trend}</p>
    </div>
  );
};
