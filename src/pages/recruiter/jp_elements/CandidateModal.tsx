import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';

interface CandidateDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    score: number;
    reasons: string[];
}

// Function to get score color class - same as in CandidateList.tsx
const getScoreColorClass = (score: number) => {
  if (score >= 70) return 'bg-green-500';
  if (score >= 40) return 'bg-yellow-400';
  return 'bg-red-500';
};

// This component displays detailed information about a candidate in a modal form
// To use it a candidate's name, score, and reasons must be passed to it.
const CandidateDetailModal: React.FC<CandidateDetailModalProps> = (
    {
       isOpen,
       onClose,
       name,
       score,
       reasons,
    }) => {
    if (!isOpen) return null;

    const scoreColor = getScoreColorClass(score);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl relative">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 text-left flex-1">{name}</h2>
                    <div className="flex flex-col items-center ml-2 pr-14 pt-2 ">
                        <div className={`w-20 h-20 flex items-center justify-center rounded-full text-white text-3xl font-bold shadow-lg border-4 border-white ${scoreColor}`}>
                            {score}
                        </div>
                        <span className="text-gray-700 text-base mt-1 font-semibold">Puntaje</span>
                    </div>
                </div>

                <h3 className="text-md font-semibold mb-2 text-blue-700">Observaciones:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 mb-2">
                    {reasons.map((reason, idx) => (
                        <li key={idx}>{reason}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CandidateDetailModal;
