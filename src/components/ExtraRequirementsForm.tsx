import React, { useState, useEffect } from 'react';

export interface ExtraRequirements {
  freeText: string;
  seniority: string[];
  englishLevel: string;
  industryRequired: boolean;
  industryText: string;
  contractTypes: string[];
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

  useEffect(() => {
    onChange({
      freeText,
      seniority,
      englishLevel,
      industryRequired,
      industryText: industryRequired ? industryText : '',
      contractTypes,
    });
  }, [freeText, seniority, englishLevel, industryRequired, industryText, contractTypes, onChange]);

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
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Requisitos adicionales</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Requisitos personalizados</label>
        <textarea
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          rows={3}
          value={freeText}
          onChange={e => setFreeText(e.target.value)}
          placeholder="Escribe requisitos adicionales aquí..."
        />
        <p className="mt-1 text-xs text-yellow-600">El uso de texto libre puede afectar la precisión del modelo.</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Seniority</label>
        <div className="flex gap-4">
          {['Junior', 'Mid', 'Senior'].map(level => (
            <label key={level} className="inline-flex items-center">
              <input
                type="checkbox"
                value={level}
                checked={seniority.includes(level)}
                onChange={() => toggleSeniority(level)}
                className="form-checkbox"
              />
              <span className="ml-2 text-gray-700">{level}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de inglés</label>
        <select
          className="mt-1 block w-full border border-gray-300 rounded p-2"
          value={englishLevel}
          onChange={e => setEnglishLevel(e.target.value)}
        >
          <option value="">Seleccione nivel</option>
          <option value="Básico">Básico</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Avanzado">Avanzado</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Experiencia en industria específica</label>
        <div className="flex items-center gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="industryRequired"
              value="yes"
              checked={industryRequired}
              onChange={() => setIndustryRequired(true)}
              className="form-radio"
            />
            <span className="ml-2 text-gray-700">Sí</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="industryRequired"
              value="no"
              checked={!industryRequired}
              onChange={() => setIndustryRequired(false)}
              className="form-radio"
            />
            <span className="ml-2 text-gray-700">No</span>
          </label>
        </div>
        {industryRequired && (
          <input
            type="text"
            className="mt-2 block w-full border border-gray-300 rounded p-2"
            placeholder="Ingrese industria"
            value={industryText}
            onChange={e => setIndustryText(e.target.value)}
          />
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de contrato o disponibilidad</label>
        <div className="flex flex-col gap-2">
          {['Full-time', 'Part-time', 'Freelance', 'Temporal'].map(type => (
            <label key={type} className="inline-flex items-center">
              <input
                type="checkbox"
                value={type}
                checked={contractTypes.includes(type)}
                onChange={() => toggleContractType(type)}
                className="form-checkbox"
              />
              <span className="ml-2 text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExtraRequirementsForm; 