import { useParams } from 'react-router-dom';
import { useGetJobById } from '@/hooks/useGetJobById.ts';
import CandidateList from '@/components/CandidateList';
import { CVDropzone } from "@/components/CVDropzone";
import { useState } from 'react';
import AnalysisButton from '@/components/AnalysisButton';

const JobPostingDetails = () => {
  const { jobId } = useParams(); //la ruta será /recruiter/:jobId
  const { job, isLoading, error } = useGetJobById(jobId ?? '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState('');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    // #TODO: lógica para guardar status en la DB
    console.log('Cambiar status a:', newStatus);
  };

  const handleEditClick = () => {
    setIsEditingDescription(true);
    setNewDescription(job?.description ?? '');
  };

  const handleSaveClick = () => {
    // #TODO: lógica para guardar nueva descripción en la DB
    setIsEditingDescription(false);
    console.log('Guardar nueva descripción:', newDescription);
  };

  if (isLoading) return <p className="p-4">Cargando datos del puesto...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!job) return <p className="p-4">No se encontró el puesto de trabajo.</p>;

  return (
    <div className="min-h-screen bg-blue-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
          <select
            defaultValue={job.status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
            <option value="-1">Cancelado</option>
          </select>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Descripción del Puesto</h2>
          {isEditingDescription ? (
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          ) : (
            <p className="bg-gray-100 p-4 rounded">{job.description}</p>
          )}
          <div className="mt-2 flex gap-2">
            {isEditingDescription ? (
              <button
                onClick={handleSaveClick}
                className="px-4 py-1 bg-green-500 text-white rounded"
              >
                Guardar
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className="px-4 py-1 bg-blue-500 text-white rounded"
              >
                Editar
              </button>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Resultados del análisis</h2>
          <CandidateList jobId={job.pk} candidates={[]} />
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Cargar nuevos CVs</h2>
          <CVDropzone jobId={job.pk} />
          <div className="mt-4">
            <AnalysisButton jobId={job.pk} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetails;
