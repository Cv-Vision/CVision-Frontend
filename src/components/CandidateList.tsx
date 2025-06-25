import { useState } from 'react';
import { Table } from './dashboard/Table';
import { TableCell } from './dashboard/TableCell';
import { CandidateRatingDropdown } from './CandidateRatingDropdown';
import CandidateModal from '../pages/recruiter/jp_elements/CandidateModal';
import { useGetCandidatesByJobId } from '@/hooks/useGetCandidatesByJobId';
import { useGetAnalysisResults } from '@/hooks/useGetAnalysisResults';
import Toast from './Toast';
import { deleteCandidatesFromJob } from '@/services/cvAnalysisService';

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string; isVisible: boolean }>({ type: 'success', message: '', isVisible: false });
  const { candidates, isLoading, error, refetch } = useGetCandidatesByJobId(jobId);
  const { results: analysisResults } = useGetAnalysisResults(jobId);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    if (selectedIds.length === candidates.length) setSelectedIds([]);
    else setSelectedIds(candidates.map((c) => c.id));
  };
  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      await deleteCandidatesFromJob(jobId, selectedIds);
      setToast({ type: 'success', message: 'Candidatos eliminados correctamente.', isVisible: true });
      setSelectedIds([]);
      refetch();
    } catch (err: any) {
      setToast({ type: 'error', message: err.message || 'Error al eliminar candidatos.', isVisible: true });
    }
  };

  if (isLoading) return <div className="p-4">Cargando...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!candidates.length) return <div className="p-4 text-gray-500">No hay candidatos</div>;

  const headers = ['', 'Candidato', 'Score'];
  const rows = candidates.map((candidate) => [
    <TableCell key={`check-${candidate.id}`} className="text-center">
      <input
        type="checkbox"
        checked={selectedIds.includes(candidate.id)}
        onChange={() => handleSelect(candidate.id)}
        onClick={e => e.stopPropagation()}
      />
    </TableCell>,
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
      <div className="flex items-center gap-2 mb-2">
        <input type="checkbox" checked={selectedIds.length === candidates.length} onChange={handleSelectAll} />
        <span className="font-semibold">Seleccionar todos</span>
        <button
          className={`px-3 py-1 rounded bg-red-500 text-white font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed`}
          disabled={selectedIds.length === 0}
          onClick={() => setShowConfirm(true)}
        >
          Eliminar seleccionados
        </button>
      </div>
      <Table headers={headers} rows={rows} />
      <CandidateModal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        selectedCandidate={selectedCandidate}
        analysisResults={analysisResults}
      />
      {/* Confirmación de eliminación */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">¿Eliminar {selectedIds.length} candidato(s)?</h3>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setShowConfirm(false)}>Cancelar</button>
              <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
      <Toast
        type={toast.type}
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={() => setToast(t => ({ ...t, isVisible: false }))}
      />
    </div>
  );
};

export default CandidateList;
