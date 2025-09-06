import React, { useState } from 'react';
import { Table } from '../dashboard/Table.tsx';
import { TableCell } from '../dashboard/TableCell.tsx';
import { ApplicantRatingDropdown } from './ApplicantRatingDropdown.tsx';
import ApplicantModal from '../../pages/recruiter/jp_elements/ApplicantModal.tsx';
import { useGetApplicantsByJobId } from '@/hooks/useGetApplicantsByJobId.ts';
import { useGetAnalysisResults } from '@/hooks/useGetAnalysisResults.ts';
import { deleteApplicantsFromJob } from '@/services/cvAnalysisService.ts';
import { TrashIcon, UserIcon} from '@heroicons/react/24/outline';
import { useToast } from '../../context/ToastContext';

interface ApplicantListProps {
  jobId: string;
  onApplicantDeleted?: () => void;
}

const getScoreColorClass = (score: number | null) => {
  if (score === null || score === undefined) return 'bg-gray-100 text-gray-600 border-gray-200';
  if (score >= 70) return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
  if (score >= 40) return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300';
  return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300';
};

const ApplicantList: React.FC<ApplicantListProps> = ({ jobId, onApplicantDeleted }) => {
  const [selectedApplicant, setSelectedApplicant] = useState<null | { fullName: string; score: number | null, applicationId: string, cvId: string }>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast }: { showToast: (message: string, type?: 'success' | 'error' | 'info') => void } = useToast();
  const { applicants, isLoading, error, refetch } = useGetApplicantsByJobId(jobId);
  useGetAnalysisResults(jobId);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    if (selectedIds.length === applicants.length) setSelectedIds([]);
    else setSelectedIds(applicants.map((c) => c.id));
  };
  const handleDelete = async () => {
    setShowConfirm(false);
    try {
      await deleteApplicantsFromJob(selectedIds);
      showToast('Aplicantes eliminados correctamente.', 'success');
      setSelectedIds([]);
      refetch();
      if (onApplicantDeleted) onApplicantDeleted();
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar aplicantes.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-600 font-medium">Cargando aplicantes...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-4 text-center">
        <div className="flex flex-col items-center space-y-2">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-semibold">Error al cargar aplicantes</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!applicants.length) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-6 text-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 rounded-full bg-gray-100">
            <UserIcon className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-800 font-semibold">No hay aplicantes</p>
          <p className="text-gray-600 text-sm">Aún no se han registrado aplicantes para este puesto.</p>
        </div>
      </div>
    );
  }

  const headers = ['', 'Aplicante', 'Score'];
  const rows = applicants.map((applicant) => [
    <TableCell key={`check-${applicant.id}`} className="text-center">
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={selectedIds.includes(applicant.id)}
          onChange={() => handleSelect(applicant.id)}
          onClick={e => e.stopPropagation()}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
      </div>
    </TableCell>,
    <TableCell key={`name-${applicant.id}`}> 
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <span className="font-semibold text-gray-900">
          {applicant.fullName}
        </span>
        <div className="z-20 relative" onClick={(e) => e.stopPropagation()}>
          
          <ApplicantRatingDropdown jobId={jobId} cvId={applicant.id} initialValue={applicant.status || ''} />
        </div>
      </div>
    </TableCell>,
    <TableCell key={`score-${applicant.id}`} className="text-center">
      <span
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${getScoreColorClass(
          applicant.score
        )}`}
      >
        {applicant.score !== null && applicant.score !== undefined ? applicant.score : 'N/A'}
      </span>
    </TableCell>,
  ]);

  const handleRowClick = (rowIndex: number) => {
    const applicant = applicants[rowIndex];
    setSelectedApplicant({ fullName: applicant.fullName, score: applicant.score, applicationId: applicant.id, cvId: applicant.id });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-3">
          <input 
            type="checkbox" 
            checked={selectedIds.length === applicants.length && applicants.length > 0} 
            onChange={handleSelectAll}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="font-semibold text-gray-800">
            {selectedIds.length > 0 ? `${selectedIds.length} seleccionado${selectedIds.length > 1 ? 's' : ''}` : 'Seleccionar todos'}
          </span>
        </div>
        <button
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
            selectedIds.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 shadow-md hover:shadow-lg'
          }`}
          disabled={selectedIds.length === 0}
          onClick={() => setShowConfirm(true)}
        >
          <TrashIcon className="h-4 w-4" />
          <span>Eliminar</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Table headers={headers} rows={rows} onRowClick={handleRowClick} />
      </div>
      
      <ApplicantModal
        isOpen={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        selectedApplicant={selectedApplicant}
      />
      
      {/* Confirmación de eliminación mejorada */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-full bg-red-100">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Confirmar eliminación</h3>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar {selectedIds.length} aplicante{selectedIds.length > 1 ? 's' : ''}? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 font-medium" 
                onClick={() => setShowConfirm(false)}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold flex items-center space-x-2" 
                onClick={handleDelete}
              >
                <TrashIcon className="h-4 w-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      </div>
  );
};

export default ApplicantList;
