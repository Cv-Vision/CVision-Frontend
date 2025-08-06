import { TableCell } from './TableCell';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Job } from "@/context/JobContext.tsx";

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

// Función para determinar el color del estado
const getStatusColorClass = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
        case 'INACTIVE':
            return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300';
        case 'CANCELLED':
            return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300';
        case 'DELETED':
            return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
        default:
            return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
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
            <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors duration-200 truncate">
                    {job.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium truncate">{job.company}</p>
            </div>
        </TableCell>,

        <TableCell key="desc" onClick={() => onRowClick(job.pk)}>
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                {job.description}
            </p>
        </TableCell>,

        <TableCell key="status">
            <div className="flex items-center justify-center">
                <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(String(job.status))}`}>
                {statusMap[String(job.status)] || job.status}
            </span>
            </div>
        </TableCell>,

        <TableCell key="actions">
            <div className="flex items-center justify-center">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(job.pk);
                    }}
                    className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center gap-2"
                    title="Eliminar puesto"
                >
                    <TrashIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">Eliminar</span>
                </button>
            </div>
        </TableCell>,
    ];
}
