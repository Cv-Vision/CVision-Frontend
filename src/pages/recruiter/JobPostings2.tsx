import { Table } from '@/components/dashboard/Table';
import { JobRow } from '@/components/dashboard/JobPostingRow.tsx';
import { getJobs } from '@/hooks/GetJobs.ts';
import { useNavigate } from 'react-router-dom';

const JobPostings2: React.FC = () => {
    const { jobs, isLoading, error } = getJobs();
    const nav = useNavigate();

    const handleView = (id: number) => nav(`/recruiter/job/${id}/analysis`);
    const handleEdit = (id: number) => nav(`/recruiter/edit-job/${id}`);
    const handleDelete = (id: number) => alert(`Falta implementar delete ${id}`);

    const headers = ['Título','Descripción','Estado','Acciones'];

    const exampleJob = {
        id: 1,
        title: 'Desarrollador Frontend Senior',
        description: 'Buscamos un desarrollador Frontend Senior con experiencia en React, TypeScript y Tailwind CSS. El candidato ideal debe tener al menos 5 años de experiencia en desarrollo web y un fuerte conocimiento de patrones de diseño y arquitectura de software.',
        status: 'Activo',
        questions: ["example question 1", "example question 2"],
        company: 'TechCorp',
        createdAt: '2025-06-01'
    };


    // todo: remove exampleJob and just keep the data feching
    const rows = [
        JobRow({
            job: exampleJob,
            onView: handleView,
            onEdit: handleEdit,
            onDelete: handleDelete,
            isLoading
        }),
        ...jobs.map(job =>
            JobRow({
                job,
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
                isLoading
            })
        )
    ];

    return (
        <>
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <Table headers={headers} rows={rows} />
        </>
    );
};

export default JobPostings2;

