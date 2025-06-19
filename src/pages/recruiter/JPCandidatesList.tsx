import React from 'react';
import { Table } from '@/components/dashboard/Table';
import { TableCell } from '@/components/dashboard/TableCell';
import { useGetCandidates } from '@/hooks/useGetCandidates';
import { useNavigate } from 'react-router-dom';

// Props for the JPCandidatesList component left it small just with jobId in case it is later extended
interface JPCandidatesListProps {
    jobId: string;
}

// To use this component, pass the jobId prop with the ID of the job posting you want to fetch candidates for.
const JPCandidatesList: React.FC<JPCandidatesListProps> = ({ jobId }) => {
    const { candidates, isLoading, error } = useGetCandidates(jobId);
    const navigate = useNavigate();

    if (isLoading) return <p className="text-gray-500">Cargando candidatos…</p>;
    if (error)     return <p className="text-red-600">{error}</p>;

    const headers = ['Nombre', 'Fecha de aplicación', 'CV'];
    const rows = candidates.map(c => [
        <TableCell key={`name-${c.cv_id}`} onClick={() => navigate(`/candidate/${c.cv_id}`)}>{c.name}</TableCell>,
        <TableCell key={`date-${c.cv_id}`}>{new Date(c.created_at).toLocaleString()}</TableCell>,
        <TableCell key={`cv-${c.cv_id}`}>
            <a
                href={c.cv_s3_key}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
                download
            >
                {/*todo: fix the CV downloading logic in S3*/}
                Descargar CV
            </a>
        </TableCell>
    ]);

    return (
        <div>
            {candidates.length === 0
                ? <p className="text-gray-600">No hay candidatos aún.</p>
                : <Table headers={headers} rows={rows} />
            }
        </div>
    );
};

export default JPCandidatesList;
