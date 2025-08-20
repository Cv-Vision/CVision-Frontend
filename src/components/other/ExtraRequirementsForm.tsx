import React, { useState, useEffect } from 'react';
import { CogIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export interface ExtraRequirements {
  freeText: string;
  seniority: string[];
  englishLevel: string;
  industryRequired: boolean;
  industryText: string;
  contractTypes: string[];
  location: string;
}

interface ExtraRequirementsFormProps {
  onChange: (req: ExtraRequirements) => void;
}

const ExtraRequirementsForm: React.FC<ExtraRequirementsFormProps> = ({ onChange }) => {
  const [freeText, setFreeText] = useState('');
  const [seniority, setSeniority] = useState<string[]>([]);
  const [englishLevel, setEnglishLevel] = useState('');
  const [industryRequired, setIndustryRequired] = useState(false);
  const [industryText, setIndustryText] = useState('');
  const [contractTypes, setContractTypes] = useState<string[]>([]);
  const [location, setLocation] = useState('');

  useEffect(() => {
    onChange({
      freeText,
      seniority,
      englishLevel,
      industryRequired,
      industryText: industryRequired ? industryText : '',
      contractTypes,
      location: location,
    });
  }, [freeText, seniority, englishLevel, industryRequired, industryText, contractTypes, location, onChange]);

  const toggleSeniority = (level: string) => {
    setSeniority(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleContractType = (type: string) => {
    setContractTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CogIcon className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-blue-800">Requisitos adicionales</h3>
      </div>

      {/* Requisitos personalizados */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-blue-800">Requisitos personalizados</label>
        <textarea
          className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
          rows={3}
          value={freeText}
          onChange={e => setFreeText(e.target.value)}
          placeholder="Escribe requisitos adicionales aquí..."
        />
        <div className="flex items-center gap-2 text-amber-600 text-xs">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
          <span className="font-bold">El uso de texto libre puede afectar la precisión del modelo.</span>
        </div>
      </div>

      {/* Seniority */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-blue-800">Seniority</label>
        <div className="flex gap-4">
          {['Junior', 'Mid', 'Senior'].map(level => (
            <label key={level} className="inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                value={level}
                checked={seniority.includes(level)}
                onChange={() => toggleSeniority(level)}
                className="w-4 h-4 text-blue-600 bg-white border-2 border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-300"
              />
              <span className="ml-2 text-blue-700 font-medium group-hover:text-blue-800 transition-colors duration-300">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Nivel de inglés */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-blue-800">Nivel de inglés</label>
        <select
          className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
          value={englishLevel}
          onChange={e => setEnglishLevel(e.target.value)}
        >
          <option value="">Seleccione nivel</option>
          <option value="No requerido">No requerido</option>
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
          <option value="Nativo">Nativo</option>
        </select>
      </div>

      {/* Experiencia en industria */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-blue-800">Experiencia en industria específica</label>
        <div className="flex items-center gap-6">
          <label className="inline-flex items-center cursor-pointer group">
            <input
              type="radio"
              name="industryRequired"
              value="yes"
              checked={industryRequired}
              onChange={() => setIndustryRequired(true)}
              className="w-4 h-4 text-blue-600 bg-white border-2 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-300"
            />
            <span className="ml-2 text-blue-700 font-medium group-hover:text-blue-800 transition-colors duration-300">Sí</span>
          </label>
          <label className="inline-flex items-center cursor-pointer group">
            <input
              type="radio"
              name="industryRequired"
              value="no"
              checked={!industryRequired}
              onChange={() => setIndustryRequired(false)}
              className="w-4 h-4 text-blue-600 bg-white border-2 border-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-300"
            />
            <span className="ml-2 text-blue-700 font-medium group-hover:text-blue-800 transition-colors duration-300">No</span>
          </label>
        </div>
        {industryRequired && (
          <input
            type="text"
            className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
            placeholder="Ingrese industria específica"
            value={industryText}
            onChange={e => setIndustryText(e.target.value)}
          />
        )}
      </div>

      {/* Tipo de contrato */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-blue-800">Tipo de contrato o disponibilidad</label>
        <div className="grid grid-cols-2 gap-3">
          {['Full-time', 'Part-time', 'Freelance', 'Temporal'].map(type => (
            <label key={type} className="inline-flex items-center cursor-pointer group">
              <input
                type="checkbox"
                value={type}
                checked={contractTypes.includes(type)}
                onChange={() => toggleContractType(type)}
                className="w-4 h-4 text-blue-600 bg-white border-2 border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-300"
              />
              <span className="ml-2 text-blue-700 font-medium group-hover:text-blue-800 transition-colors duration-300 text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ubicación */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-blue-800">Ubicación</label>
        <input
          type="text"
          className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
          placeholder="Ej: Buenos Aires,Madrid, Barcelona, Texas"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ExtraRequirementsForm; 