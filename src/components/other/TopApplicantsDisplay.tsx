import React from 'react';

interface Applicant {
  id: string;
  fullName: string;
  score: number | null;
  rawReasons: string[];
}

interface TopApplicantsDisplayProps {
  applicants: Applicant[];
}

const getScoreColorClass = (score: number | null) => {
  if (score === null || score === undefined) return 'bg-gray-100 text-gray-600 border-gray-200';
  if (score >= 70) return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
  if (score >= 40) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
  return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
};

const TopApplicantsDisplay: React.FC<TopApplicantsDisplayProps> = ({ applicants }) => {

  if (applicants.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-gray-600">No hay aplicantes para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applicants.map(applicant => (
        <div key={applicant.id} className="flex flex-col p-3 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-900">{applicant.fullName}</span>
            <span
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${getScoreColorClass(
                applicant.score
              )}`}
            >
              {applicant.score !== null && applicant.score !== undefined ? applicant.score : 'N/A'}
            </span>
          </div>
          {applicant.rawReasons.length > 0 && (
            <div className="text-sm text-gray-700 mt-2">
              <p className="font-medium text-gray-800">Razones:</p>
              <ul className="list-disc list-inside text-gray-600">
                {applicant.rawReasons.map((reason, i) => <li key={i}>{reason}</li>)}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TopApplicantsDisplay;
