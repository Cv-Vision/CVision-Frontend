import { TableCell } from './TableCell';
import { TrashIcon } from '@heroicons/react/24/solid';
import {Job} from "@/context/JobContext.tsx";

interface JobRowProps {
    job: Job;
    onRowClick: (id: string) => void;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: string) => void;
    isLoading: boolean;
}

// Mapeo de status en inglés a español
const statusMap: Record<string, string> = {
    ACTIVE: 'Activo',
    INACTIVE: 'Inactivo',
    CANCELLED: 'Cancelado',
    DELETED: 'Eliminado',
};

export function JobRow({ 
    job, 
    onRowClick, 
    onDelete,
    onStatusChange
}: JobRowProps) {
    console.log('JobRow called with job:', job);

    // Map status values to display labels and colors
    // todo: Cambiar los valores de statusMap a los que se usan en el backend, por ahora son los mismos que en el frontend (donde dice "ACTIVE", "closed", "archived")
    const statusMap: Record<string, { label: string; color: string }> = {
        ACTIVE: { label: 'Abierta', color: 'text-green-800 bg-green-100' },
        closed: { label: 'Cerrada', color: 'text-red-800 bg-red-100' },
        archived: { label: 'Archivada', color: 'text-gray-800 bg-gray-200' },
    };

    // todo: Cambiar los valores de statusMap a los que se usan en el backend, por ahora son los mismos que en el frontend (donde dice "ACTIVE", "closed", "archived")
    const statusOptions = [
        { value: 'ACTIVE', label: 'Abierta' },
        { value: 'closed', label: 'Cerrada' },
        { value: 'archived', label: 'Archivada' },
    ];
    const currentStatus = statusMap[job.status] || { label: job.status, color: 'text-gray-800 bg-gray-100' };

    return [
        <TableCell key="title" onClick={() => onRowClick(job.pk)}>
            <div className="text-sm font-medium text-gray-900">{job.title}</div>
            <div className="text-sm text-gray-500">{job.company}</div>
        </TableCell>,

        <TableCell key="desc" onClick={() => onRowClick(job.pk)}>
            <div className="text-sm text-gray-900 line-clamp-2">{job.description}</div>
        </TableCell>,

        <TableCell key="status">
            <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold border border-gray-300 ${currentStatus.color}`}
                style={{ marginBottom: 4 }}
            >
                {currentStatus.label}
            </span>
            <select
                className="ml-2 px-2 py-1 rounded border border-gray-300 text-xs font-semibold bg-white text-gray-800"
                value={job.status}
                onChange={e => onStatusChange(job.pk, e.target.value)}
            >
                {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </TableCell>,

        <TableCell key="actions">
            <div className="flex gap-2">
                <button
                    onClick={() => onDelete(job.pk)}
                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                >
                    <TrashIcon className="h-5 w-5" /> Eliminar
                </button>
            </div>
        </TableCell>,
    ];
}
