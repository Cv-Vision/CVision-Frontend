import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { Table } from './dashboard/Table';
import { TableCell } from './dashboard/TableCell';

interface Candidate {
  id: string;
  fullName: string;
  score: number;
  cvUrl: string;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    detailedFeedback: string;
  };
}

interface CandidateListProps {
  jobId: string;
  candidates: Candidate[];
  isLoading?: boolean;
  error?: string | null;
}

// Utility function to determine color based on score
const getScoreColorClass = (score: number) => {
  if (score >= 70) {
    return 'bg-green-100 text-green-800'; // High score
  } else if (score >= 40) {
    return 'bg-yellow-100 text-yellow-800'; // Medium score
  } else {
    return 'bg-red-100 text-red-800'; // Low score
  }
};

const CandidateList: React.FC<CandidateListProps> = ({
                                                       jobId,
                                                       candidates,
                                                       isLoading = false,
                                                       error = null,
                                                     }) => {
  const [expandedCandidate, setExpandedCandidate] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleCandidate = (candidateId: string) => {
    setExpandedCandidate(expandedCandidate === candidateId ? null : candidateId);
  };

  const handleDownloadCV = async (cvUrl: string, candidateName: string) => {
    try {
      const response = await fetch(cvUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${candidateName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading CV:', err);
      alert('Error al descargar el CV. Por favor, intente nuevamente.');
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
    );
  }

  if (candidates.length === 0) {
    return (
        <div className="text-center py-8 text-gray-500">
          No hay candidatos para mostrar
        </div>
    );
  }

  // Create table headers and rows for the Table component
  const headers = ['Candidato', 'Score', 'CV', 'Análisis', 'Acciones'];

  const rows = candidates.map((candidate) => [
    // Candidate Name
    <TableCell key={`name-${candidate.id}`}>
      <div className="font-semibold text-gray-900">{candidate.fullName}</div>
    </TableCell>,

    // Score with color based on value
    <TableCell key={`score-${candidate.id}`}>
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getScoreColorClass(candidate.score)}`}>
        {candidate.score}
      </span>
    </TableCell>,

    // CV Download Button
    <TableCell key={`cv-${candidate.id}`}>
      <button
          onClick={() => handleDownloadCV(candidate.cvUrl, candidate.fullName)}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        <DocumentArrowDownIcon className="h-5 w-5" />
        Descargar CV
      </button>
    </TableCell>,

    // Analysis Button
    <TableCell key={`analysis-${candidate.id}`}>
      <button
          onClick={() => navigate(`/recruiter/job/${jobId}/analysis?highlight=${candidate.id}`)}
          className="text-blue-600 hover:underline"
      >
        Ver análisis
      </button>
    </TableCell>,

    // Expand/Collapse Button
    <TableCell key={`actions-${candidate.id}`}>
      <button
          onClick={() => toggleCandidate(candidate.id)}
          className="text-gray-400 hover:text-gray-600"
      >
        {expandedCandidate === candidate.id ? (
            <ChevronUpIcon className="h-6 w-6" />
        ) : (
            <ChevronDownIcon className="h-6 w-6" />
        )}
      </button>
    </TableCell>
  ]);

  return (
      <div className="space-y-4">
        <Table headers={headers} rows={rows} />

        {/* Expanded candidate details */}
        {expandedCandidate && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden p-4 mt-2">
              {candidates
                  .filter(candidate => candidate.id === expandedCandidate)
                  .map(candidate => (
                      <div key={candidate.id} className="mt-4 space-y-4 pt-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Fortalezas</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {candidate.analysis.strengths.map((strength, index) => (
                                <li key={index}>{strength}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Áreas de Mejora</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {candidate.analysis.weaknesses.map((weakness, index) => (
                                <li key={index}>{weakness}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Recomendaciones</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {candidate.analysis.recommendations.map((recommendation, index) => (
                                <li key={index}>{recommendation}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Análisis Detallado</h4>
                          <p className="text-gray-600 whitespace-pre-wrap">
                            {candidate.analysis.detailedFeedback}
                          </p>
                        </div>
                      </div>
                  ))}
            </div>
        )}
      </div>
  );
};

export default CandidateList;