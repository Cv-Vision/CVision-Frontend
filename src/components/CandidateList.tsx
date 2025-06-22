import React, { useEffect, useState } from 'react';
import { Table } from './dashboard/Table';
import { TableCell } from './dashboard/TableCell';
import { CandidateRatingDropdown } from './CandidateRatingDropdown';
import CandidateDetailModal from './../pages/recruiter/jp_elements/CandidateModal';
import { getGeminiAnalysisResults, GeminiAnalysisResult } from '@/services/geminiAnalysisService';

interface Candidate {
  rating?: string;
  id: string;
  fullName: string;
  score: number;
  cvUrl: string;
}

interface CandidateListProps {
  jobId: string;
  candidates: Candidate[];
  isLoading?: boolean;
  error?: string | null;
}

const getScoreColorClass = (score: number) => {
  if (score >= 70) return 'bg-green-100 text-green-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const CandidateList: React.FC<CandidateListProps> = ({
                                                       jobId,
                                                       candidates,
                                                       isLoading = false,
                                                       error = null,
                                                     }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [analysisResults, setAnalysisResults] = useState<GeminiAnalysisResult[]>([]);

  useEffect(() => {
    if (!jobId) return;
    getGeminiAnalysisResults(jobId)
      .then(setAnalysisResults)
      .catch(() => setAnalysisResults([]));
  }, [jobId]);

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
      <div className="text-center py-8 text-gray-500">No hay candidatos para mostrar</div>
    );
  }

  const headers = ['Candidato', 'Score'];
  const rows = candidates.map((candidate) => [
    <TableCell key={`name-${candidate.id}`}>
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md"
        onClick={() => setSelectedCandidate(candidate)}
      >
        <span className="font-semibold text-gray-900">
          {candidate.fullName}
        </span>

        <div onClick={(e) => e.stopPropagation()}>
          <CandidateRatingDropdown
            jobId={jobId}
            cvId={candidate.id}
            initialValue={candidate.rating || ''}
          />
        </div>
      </div>
    </TableCell>,

    <TableCell key={`score-${candidate.id}`} className="text-center">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreColorClass(candidate.score)}`}>
        {candidate.score}
      </span>
    </TableCell>
  ]);

  const selectedAnalysis = selectedCandidate
    ? analysisResults.find((r) => r.participant_id === selectedCandidate.id)
    : null;

  return (
    <div className="space-y-4">
      <Table headers={headers} rows={rows} />

      {selectedCandidate && (
        <CandidateDetailModal
          isOpen={true}
          onClose={() => setSelectedCandidate(null)}
          name={selectedCandidate.fullName}
          score={selectedCandidate.score}
          reasons={selectedAnalysis?.reasons || ['Sin observaciones disponibles.']}
        />
      )}
    </div>
  );
};

export default CandidateList;
