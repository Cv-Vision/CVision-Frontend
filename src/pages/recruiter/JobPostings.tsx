import { Table } from '@/components/dashboard/Table';
import { JobRow } from '@/components/dashboard/JobPostingRow.tsx';
import { useGetJobs } from '@/hooks/useGetJobs';
import { useNavigate } from 'react-router-dom';
import {BriefcaseIcon} from "@heroicons/react/24/solid";
import {PlusIcon} from "@heroicons/react/16/solid";
import BackButton from '@/components/BackButton';
import { useUpdateJobPostingData } from '@/hooks/useUpdateJobPostingData';

const JobPostings: React.FC = () => {
  const { jobs, isLoading, error, refetch } = useGetJobs();
  const nav = useNavigate();
  const { updateJobPostingData }  = useUpdateJobPostingData();

  const handleRowClick = (id: string) => nav(`/recruiter/job/${id}`);

  const handleView = (id: number) => nav(`/recruiter/job/${id}/analysis`);
  const handleEdit = (id: number) => nav(`/recruiter/edit-job/${id}`);
  const handleDelete = async (id: string) => {
    try {
      await updateJobPostingData(id, { status: 'DELETED' });
      refetch(true);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const headers = ['Título', 'Descripción', 'Estado', 'Acciones'];
  const rows = jobs.map(job =>
    JobRow({
      job,
      onRowClick: handleRowClick,
      onView: handleView,
      onEdit: handleEdit,
      onDelete: handleDelete,
      isLoading
    })
  );

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <BackButton />
          {/* HEADER with Add‑Job button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="h-8 w-8 text-green-400" />
              <h1 className="text-3xl font-bold text-gray-800">Puestos de trabajo</h1>
            </div>
            <button
              onClick={() => nav('/recruiter/create-job')}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Agregar puesto</span>
            </button>
          </div>

          {isLoading && (
            <div className="text-center text-gray-500">Cargando puestos de trabajo...</div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {!isLoading && !error && jobs.length === 0 && (
            <div className="text-center text-gray-600">
              No tienes puestos de trabajo publicados para mostrar.
            </div>
          )}

          {!isLoading && !error && jobs.length > 0 && (
            <Table headers={headers} rows={rows} />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPostings;
