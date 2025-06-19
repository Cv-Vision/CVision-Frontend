import { Table } from '@/components/dashboard/Table';
import { JobRow } from '@/components/dashboard/JobPostingRow.tsx';
import { useGetJobs } from '@/hooks/useGetJobs';
import { useNavigate } from 'react-router-dom';
import {BriefcaseIcon} from "@heroicons/react/24/solid";
import {PlusIcon} from "@heroicons/react/16/solid";
import BackButton from '@/components/BackButton';
import { useState, useMemo } from 'react';

const JobPostings: React.FC = () => {
  const { jobs, isLoading, error } = useGetJobs();
  const nav = useNavigate();
  // todo: Cambiar los valores de statusFilter a los que se usan en el backend, por ahora son los mismos que en el frontend (donde dice "all", "open", "closed")
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'archived'>('all');
  const headers = ['Título', 'Descripción', 'Estado', 'Acciones'];

  const handleRowClick = (id: string) => nav(`/recruiter/job/${id}`);

  const handleDelete = (id: string) => alert(`Falta implementar delete ${id}`);

  const handleStatusChange = (id: string, newStatus: string) => {
      // todo: Implementar lógica para cambiar el estado del puesto de trabajo en backend
    alert(`Falta implementar cambio de estado para ${id} a ${newStatus}`);
  };

  // filter jobs based on status filter selected
  const filteredJobs = useMemo(() => {
      if (statusFilter === 'all') return jobs;
      return jobs.filter(job => job.status.toLowerCase() === statusFilter);
      }, [jobs, statusFilter]);

    const rows = filteredJobs.map(job =>
        JobRow({
            job,
            onRowClick: handleRowClick,
            onDelete: handleDelete,
            onStatusChange: handleStatusChange,
        })
    );


  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <BackButton />
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
            <div className="flex items-center gap-2">
                {['all', 'open', 'closed', 'archived'].map((status) => {
                    let baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
                    let activeClasses = '';
                    let inactiveClasses = '';
                    if (status === 'open') {
                        activeClasses = 'bg-green-600 text-white';
                        inactiveClasses = 'bg-green-100 text-green-800 hover:bg-green-200';
                    } else if (status === 'closed') {
                        activeClasses = 'bg-red-600 text-white';
                        inactiveClasses = 'bg-red-100 text-red-800 hover:bg-red-200';
                    } else if (status === 'archived') {
                        activeClasses = 'bg-gray-600 text-white';
                        inactiveClasses = 'bg-gray-200 text-gray-800 hover:bg-gray-300';
                    } else {
                        activeClasses = 'bg-blue-600 text-white';
                        inactiveClasses = 'bg-gray-200 text-gray-700 hover:bg-gray-300';
                    }
                    return (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status as 'all' | 'open' | 'closed' | 'archived')}
                            className={
                                baseClasses + ' ' + (statusFilter === status ? activeClasses : inactiveClasses)
                            }
                        >
                            {status === 'all' ? 'Todos' : status === 'open' ? 'Abiertos' : status === 'closed' ? 'Cerrados' : 'Archivados'}
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
