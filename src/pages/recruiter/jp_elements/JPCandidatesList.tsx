import React, { useEffect, useState } from 'react';
import { Table } from '@/components/dashboard/Table.tsx';
import { TableCell } from '@/components/dashboard/TableCell.tsx';
import { useGetCandidates } from "@/hooks/useGetCandidates.ts";
import CandidateDetailModal from './CandidateModal';
import { getGeminiAnalysisResults } from '@/services/geminiAnalysisService';

interface JPCandidatesListProps {
    jobId: string;
}

const JPCandidatesList: React.FC<JPCandidatesListProps> = ({ jobId }) => {
    const { candidates} = useGetCandidates(jobId);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
    const [analysisResults, setAnalysisResults] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const results = await getGeminiAnalysisResults(jobId);
                setAnalysisResults(results);
            } catch (e) {
                console.error('Error fetching analysis results', e);
            }
        };
        fetchAnalysis();
    }, [jobId]);

    const selectedAnalysis = analysisResults.find(res => res.cv_id === selectedCandidateId);
    const selectedCandidate = candidates.find(c => c.cv_id === selectedCandidateId);

    const headers = ['Nombre', 'Fecha de aplicación', 'CV'];
    const rows = candidates.map(c => [
        <TableCell
          key={`name-${c.cv_id}`}
          onClick={() => {
              console.log("Candidato clickeado:", c.cv_id); // 👈 Agregá esto
              setSelectedCandidateId(c.cv_id);
              setModalOpen(true);
          }}
          className="cursor-pointer hover:underline text-blue-700"
        >
            {c.name}
        </TableCell>,
        <TableCell key={`date-${c.cv_id}`}>{new Date(c.created_at).toLocaleString()}</TableCell>,
        <TableCell key={`cv-${c.cv_id}`}>
            <a
              href={c.cv_s3_key}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
              download
            >
                Descargar CV
            </a>
        </TableCell>
    ]);

    return (
      <div>
          {candidates.length === 0 ? (
            <p className="text-gray-600">No hay candidatos aún.</p>
          ) : (
            <Table headers={headers} rows={rows} />
          )}

          <CandidateDetailModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            name={selectedCandidate?.name ?? 'Sin nombre'}
            score={selectedAnalysis?.score ?? 0}
            reasons={selectedAnalysis?.recommendations ?? ['No se encontraron recomendaciones.']}
          />
      </div>
    );
};

export default JPCandidatesList;
