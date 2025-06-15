import { TableCell } from './TableCell';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import {Job} from "@/context/JobContext.tsx";

interface JobRowProps {
    job: Job;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    isLoading: boolean;
}
// TODO: Eliminar el campo status del Job y usar un enum o algo similar para los estados de los trabajos asi no esta mas hardcodeado

export function JobRow({ job, onView, onEdit, onDelete, isLoading }: JobRowProps) {
    return [
        <TableCell key="title">
            <div className="text-sm font-medium text-gray-900">{job.title}</div>
            <div className="text-sm text-gray-500">{job.company}</div>
        </TableCell>,

        <TableCell key="desc">
            <div className="text-sm text-gray-900 line-clamp-2">{job.description}</div>
        </TableCell>,

        <TableCell key="status">
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {"Activo" /* Aca iria algo no hardcodeado */}
            </span>
        </TableCell>,

        <TableCell key="actions">
            <div className="flex gap-2">
                <button
                    onClick={() => onView(job.id)}
                    disabled={isLoading}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1 disabled:opacity-50"
                >
                    <EyeIcon className="h-5 w-5" /> {isLoading ? 'Cargando...' : 'Ver'}
                </button>
                <button
                    onClick={() => onEdit(job.id)}
                    className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                >
                    <PencilIcon className="h-5 w-5" /> Editar
                </button>
                <button
                    onClick={() => onDelete(job.id)}
                    className="text-red-600 hover:text-red-900 flex items-center gap-1"
                >
                    <TrashIcon className="h-5 w-5" /> Eliminar
                </button>
            </div>
        </TableCell>,
    ];
}
