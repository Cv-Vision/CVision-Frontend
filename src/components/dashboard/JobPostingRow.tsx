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
    //onView, 
    //onEdit, 
    onDelete, 
    //isLoading 
}: JobRowProps) {
    
    return [
        <TableCell key="title" onClick={() => onRowClick(job.pk)}>
            <div className="text-sm font-medium text-gray-900">{job.title}</div>
            <div className="text-sm text-gray-500">{job.company}</div>
        </TableCell>,

        <TableCell key="desc" onClick={() => onRowClick(job.pk)}>
            <div className="text-sm text-gray-900 line-clamp-2">{job.description}</div>
        </TableCell>,

        <TableCell key="status">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {statusMap[String(job.status)] || job.status}
            </span>
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
