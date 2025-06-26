import { Table } from '@/components/dashboard/Table';
import { JobRow } from '@/components/dashboard/JobPostingRow.tsx';
import { useGetJobs } from '@/hooks/useGetJobs';
import { useNavigate } from 'react-router-dom';
import {BriefcaseIcon} from "@heroicons/react/24/solid";
import {PlusIcon} from "@heroicons/react/16/solid";
import BackButton from '@/components/BackButton';
import { useUpdateJobPostingData } from '@/hooks/useUpdateJobPostingData';
import { useState, useMemo } from 'react';

type JobStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'DELETED';
type StatusFilter = 'all' | JobStatus;

const ALL_STATUSES: JobStatus[] = ['ACTIVE', 'INACTIVE', 'CANCELLED'];

const JobPostings: React.FC = () => {
  const {jobs = [], isLoading, error, refetch} = useGetJobs();
  const nav = useNavigate();
  const {updateJobPostingData} = useUpdateJobPostingData();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const headers = ['Título', 'Descripción', 'Estado', 'Acciones'];

  const handleRowClick = (id: string) => {
    nav(`/recruiter/job/${id}`);
  };

  const handleView = (id: number) => nav(`/recruiter/job/${id}/analysis`);
  const handleEdit = (id: number) => nav(`/recruiter/edit-job/${id}`);
  const handleDelete = async (id: string) => {
    try {
      await updateJobPostingData(id, {status: 'DELETED'});
      refetch(true);
    } catch (err) {
      console.error('Error al eliminar:', err);
    }
  };

  const filteredJobs = useMemo(() => {
    // Always filter out DELETED jobs
    const visibleJobs = jobs.filter(job => job.status !== 'DELETED');
    if (statusFilter === 'all') {
      return visibleJobs;
    }
    return visibleJobs.filter(job => job.status === statusFilter);
  }, [jobs, statusFilter]);

  return (
      <div className="min-h-screen bg-blue-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <BackButton/>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BriefcaseIcon className="h-8 w-8 text-green-400"/>
                <h1 className="text-3xl font-bold text-gray-800">Puestos de trabajo</h1>
              </div>
              <button
                  onClick={() => nav('/recruiter/create-job')}
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm"
              >
                <PlusIcon className="h-5 w-5"/>
                <span>Agregar puesto</span>
              </button>
            </div>

            <div className="flex items-center gap-2 mb-6">
              {['all', ...ALL_STATUSES].map((status) => {
                const base = 'px-3 py-1 rounded-full text-sm font-medium';
                let activeClasses = '';
                let inactiveClasses = '';

                switch (status) {
                  case 'ACTIVE':
                    activeClasses = 'bg-green-600 text-white';
                    inactiveClasses = 'bg-green-100 text-green-800 hover:bg-green-200';
                    break;
                  case 'INACTIVE':
                    activeClasses = 'bg-yellow-600 text-white';
                    inactiveClasses = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
                    break;
                  case 'CANCELLED':
                    activeClasses = 'bg-red-600 text-white';
                    inactiveClasses = 'bg-red-100 text-red-800 hover:bg-red-200';
                    break;
                  default: // 'all'
                    activeClasses = 'bg-blue-600 text-white';
                    inactiveClasses = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
                }

                // Textos de botón
                const label = status === 'all'
                    ? 'Todos'
                    : status === 'ACTIVE'
                        ? 'Activos'
                        : status === 'INACTIVE'
                            ? 'Inactivos'
                            : 'Cancelados';

                return (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status as StatusFilter)}
                        className={`${base} ${statusFilter === status ? activeClasses : inactiveClasses}`}
                    >
                      {label}
                    </button>
                );
              })}
            </div>

            {isLoading && (
                <div className="text-center text-gray-500">Cargando puestos de trabajo...</div>
            )}

            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
            )}

            {!isLoading && !error && filteredJobs.length === 0 && (
                <div className="text-center text-gray-600">
                  No tienes puestos de trabajo publicados para mostrar.
                </div>
            )}

            {!isLoading && !error && filteredJobs.length > 0 && (
                <Table headers={headers} rows={filteredJobs.map(job =>
                  JobRow({
                    job,
                    onRowClick: handleRowClick,
                    onView: handleView,
                    onEdit: handleEdit,
                    onDelete: handleDelete,
                    isLoading
                  })
                )} />
            )}
          </div>
        </div>
      </div>
  );
}

export default JobPostings;
