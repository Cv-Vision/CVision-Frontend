import React from 'react';
import { Table } from './dashboard/Table';
import { TableCell } from './dashboard/TableCell';

interface Candidate {
  id: string;
  fullName: string;
  score: number;
  cvUrl: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedFeedback: string;
  };
}

interface CandidateListProps {
  jobId: string;
  candidates: Candidate[];
  isLoading?: boolean;
  error?: string | null;
}

// Utility function to determine color based on score
const getScoreColorClass = (score: number) => {
  if (score >= 70) {
    return 'bg-green-100 text-green-800'; // High score
  } else if (score >= 40) {
    return 'bg-yellow-100 text-yellow-800'; // Medium score
  } else {
    return 'bg-red-100 text-red-800'; // Low score
  }
};

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  isLoading = false,
  error = null,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay candidatos para mostrar
      </div>
    );
  }

  // Create table headers and rows for the Table component
  const headers = ['Candidato', 'Score'];

  const rows = candidates.map((candidate) => [
    // Candidate Name
    <TableCell key={`name-${candidate.id}`}>
      <div className="font-semibold text-gray-900">{candidate.fullName}</div>
    </TableCell>,

    // Score with color based on value
    <TableCell key={`score-${candidate.id}`}>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreColorClass(candidate.score)}`}>
        {candidate.score}
      </span>
    </TableCell>
  ]);

  return (
    <div className="space-y-4">
      <Table headers={headers} rows={rows} />
    </div>
  );
};

export default CandidateList;