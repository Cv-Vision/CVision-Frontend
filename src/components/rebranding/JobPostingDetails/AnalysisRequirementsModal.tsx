import React, { useState } from 'react';

interface AnalysisRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (requirements: string) => void;
  isAnalyzing: boolean;
}

export const AnalysisRequirementsModal: React.FC<AnalysisRequirementsModalProps> = ({ isOpen, onClose, onAnalyze, isAnalyzing }) => {
  const [requirements, setRequirements] = useState('');

  if (!isOpen) return null;

  const handleAnalyzeClick = () => {
    onAnalyze(requirements);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl border border-white/60 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-600/10 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold text-gray-900">Requisitos Adicionales para Análisis</p>
            <p className="text-sm text-gray-500">Añade instrucciones para la IA</p>
          </div>
          <button onClick={onClose} className="px-3 py-1 text-sm rounded-md border hover:bg-gray-50">Cerrar</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Ej: El candidato debe tener experiencia en el sector financiero..."
            className="w-full h-32 px-3 py-2 border rounded-lg text-sm"
          />
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border hover:bg-gray-100">Cancelar</button>
            <button
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing}
              className={`flex items-center justify-center px-4 py-2 text-sm rounded-md text-white ${
                isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analizando...
                </>
              ) : (
                'Analizar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
