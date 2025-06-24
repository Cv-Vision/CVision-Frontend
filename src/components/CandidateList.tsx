import { useEffect, useState } from 'react';
import { Table } from './dashboard/Table';
import { TableCell } from './dashboard/TableCell';
import { CandidateRatingDropdown } from './CandidateRatingDropdown';
import CandidateModal from '../pages/recruiter/jp_elements/CandidateModal';
import { useGetCandidatesByJobId } from '@/hooks/useGetCandidatesByJobId';
import { GeminiAnalysisResult, getGeminiAnalysisResults } from '@/services/geminiAnalysisService';

interface CandidateListProps {
  jobId: string;
}

const getScoreColorClass = (score: number | null) => {
  if (score === null || score === undefined) return 'bg-gray-100 text-gray-600';
  if (score >= 70) return 'bg-green-100 text-green-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const CandidateList: React.FC<CandidateListProps> = ({ jobId }) => {
  const [selectedCandidate, setSelectedCandidate] = useState<null | { fullName: string; score: number | null }>(null);
  const [analysisResults, setAnalysisResults] = useState<GeminiAnalysisResult[]>([]);
  const { candidates, isLoading, error } = useGetCandidatesByJobId(jobId);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const results = await getGeminiAnalysisResults(jobId);
        setAnalysisResults(results);
      } catch (err) {
        console.error('Error al obtener análisis de CVs:', err);
      }
    };

    fetchAnalysis();
  }, [jobId]);

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!candidates.length) return <div className="p-4 text-gray-500">No hay candidatos</div>;

  const headers = ['Candidato', 'Score'];
  const rows = candidates.map((candidate) => [
    <TableCell key={`name-${candidate.id}`}>
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-md"
        onClick={() =>
          setSelectedCandidate({
            fullName: candidate.fullName,
            score: candidate.score,
          })
        }
      >
        <span className="font-semibold text-gray-900">{candidate.fullName}</span>
        <div onClick={(e) => e.stopPropagation()}>
          <CandidateRatingDropdown jobId={jobId} cvId={candidate.id} initialValue={candidate.rating || ''} />
        </div>
      </div>
    </TableCell>,
    <TableCell key={`score-${candidate.id}`} className="text-center">
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreColorClass(
          candidate.score
        )}`}
      >
        {candidate.score !== null && candidate.score !== undefined ? candidate.score : 'N/A'}
      </span>
    </TableCell>,
  ]);

  return (
    <div className="space-y-4">
      <Table headers={headers} rows={rows} />
      <CandidateModal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        selectedCandidate={selectedCandidate}
        analysisResults={analysisResults}
      />
    </div>
  );
};

export default CandidateList;
