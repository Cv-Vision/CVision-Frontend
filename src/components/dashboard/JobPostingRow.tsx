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

// Color classes para modalidad
const getModalColorClass = (modal: string) => {
    switch (modal) {
        case 'REMOTE':
            return 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 border border-indigo-300';
        case 'HYBRID':
            return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
        case 'ONSITE':
            return 'bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 border border-teal-300';
        default:
            return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300';
    }
};

// Color classes para tipo de contrato
const getContractTypeColorClass = (contractType: string) => {
    switch (contractType) {
        case 'FULL_TIME':
            return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
        case 'PART_TIME':
            return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300';
        case 'CONTRACT':
            return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300';
        case 'FREELANCE':
            return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300';
        case 'INTERNSHIP':
            return 'bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-800 border border-cyan-300';
        default:
            return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300';
    }
};

// Color classes para nivel de inglés
const getEnglishLevelColorClass = (englishLevel: string) => {
    switch (englishLevel) {
        case 'BASIC':
            return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300';
        case 'INTERMEDIATE':
            return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300';
        case 'ADVANCED':
            return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300';
        case 'NATIVE':
            return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
        default:
            return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300';
    }
};

// Mapeo de tipo de contrato en inglés a español
const contractTypeMap: Record<string, string> = {
    'FULL_TIME': 'Tiempo Completo',
    'PART_TIME': 'Medio Tiempo',
    'CONTRACT': 'Contrato',
    'FREELANCE': 'Freelance',
    'INTERNSHIP': 'Pasantía',
};

// Mapeo de nivel de inglés en inglés a español
const englishLevelMap: Record<string, string> = {
    'BASIC': 'Básico',
    'INTERMEDIATE': 'Intermedio',
    'ADVANCED': 'Avanzado',
    'NATIVE': 'Nativo',
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
            <p className="text-sm text-gray-700 line-clamp-1 leading-relaxed max-w-xs">
                {job.description}
            </p>
        </TableCell>,

        // NEW Modalidad column
        <TableCell key="modal">
            <div className="flex items-center justify-center">
                {job.modal ? (
                    <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getModalColorClass(job.modal)}`}>
                        {job.modal}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400 italic">—</span>
                )}
            </div>
        </TableCell>,

        // NEW Tipo de Contrato column
        <TableCell key="contract_type">
            <div className="flex items-center justify-center">
                {job.contract_type ? (
                    <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getContractTypeColorClass(job.contract_type)}`}>
                        {contractTypeMap[job.contract_type] || job.contract_type}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400 italic">—</span>
                )}
            </div>
        </TableCell>,

        // NEW Nivel de Inglés column
        <TableCell key="english_level">
            <div className="flex items-center justify-center">
                {job.english_level ? (
                    <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getEnglishLevelColorClass(job.english_level)}`}>
                        {englishLevelMap[job.english_level] || job.english_level}
                    </span>
                ) : (
                    <span className="text-xs text-gray-400 italic">—</span>
                )}
            </div>
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
