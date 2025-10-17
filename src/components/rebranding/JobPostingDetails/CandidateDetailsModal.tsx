import React from 'react';

interface CandidateDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    id: string;
    name: string;
    email: string;
    score: number;
    status: string;
    reasons?: string[];
  } | null;
}

export const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({ isOpen, onClose, candidate }) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-600/10 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">Detalles del candidato</p>
            <p className="text-sm text-gray-500">Información y razones del puntaje</p>
          </div>
          <button onClick={onClose} className="px-3 py-1 text-sm rounded-md border hover:bg-gray-50">Cerrar</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Basic info */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold">
              {candidate.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-900">{candidate.name}</p>
              <p className="text-sm text-gray-600">{candidate.email}</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-2xl font-bold text-purple-600">{candidate.score}</span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">{candidate.status}</span>
              </div>
            </div>
          </div>

          {/* Reasons */}
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-2">Razones del puntaje</p>
            {candidate.reasons && candidate.reasons.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                {candidate.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No hay razones disponibles.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailsModal;


