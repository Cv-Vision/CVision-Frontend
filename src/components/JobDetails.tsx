import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface JobRequirements {
  seniority: 'Junior' | 'Mid' | 'Senior';
  englishLevel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
  contractType: 'Full-time' | 'Part-time' | 'Freelance';
  additionalRequirements?: string;
}

interface JobDetailsProps {
  jobId: string;
  initialDescription: string;
  initialRequirements: JobRequirements;
  onSave: (description: string, requirements: JobRequirements) => Promise<void>;
}

const JobDetails: React.FC<JobDetailsProps> = ({
                                                 initialDescription,
  initialRequirements,
  onSave,
}) => {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingRequirements, setIsEditingRequirements] = useState(false);
  const [description, setDescription] = useState(initialDescription);
  const [requirements, setRequirements] = useState<JobRequirements>(initialRequirements);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveDescription = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(description, requirements);
      setIsEditingDescription(false);
    } catch (err) {
      setError('Error al guardar la descripción');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRequirements = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await onSave(description, requirements);
      setIsEditingRequirements(false);
    } catch (err) {
      setError('Error al guardar los requisitos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelDescription = () => {
    setDescription(initialDescription);
    setIsEditingDescription(false);
  };

  const handleCancelRequirements = () => {
    setRequirements(initialRequirements);
    setIsEditingRequirements(false);
  };

  return (
    <div className="space-y-6">
      {/* Job Description Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Descripción del Puesto</h2>
          {!isEditingDescription ? (
            <button
              onClick={() => setIsEditingDescription(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <PencilIcon className="h-5 w-5" />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveDescription}
                disabled={isSaving}
                className="text-green-600 hover:text-green-800 flex items-center gap-1 disabled:opacity-50"
              >
                <CheckIcon className="h-5 w-5" />
                Guardar
              </button>
              <button
                onClick={handleCancelDescription}
                disabled={isSaving}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
                Cancelar
              </button>
            </div>
          )}
        </div>
        {isEditingDescription ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
            placeholder="Ingrese la descripción del puesto..."
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
        )}
      </div>

      {/* Requirements Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Requisitos</h2>
          {!isEditingRequirements ? (
            <button
              onClick={() => setIsEditingRequirements(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <PencilIcon className="h-5 w-5" />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSaveRequirements}
                disabled={isSaving}
                className="text-green-600 hover:text-green-800 flex items-center gap-1 disabled:opacity-50"
              >
                <CheckIcon className="h-5 w-5" />
                Guardar
              </button>
              <button
                onClick={handleCancelRequirements}
                disabled={isSaving}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5" />
                Cancelar
              </button>
            </div>
          )}
        </div>

        {isEditingRequirements ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seniority
              </label>
              <select
                value={requirements.seniority}
                onChange={(e) => setRequirements(prev => ({ ...prev, seniority: e.target.value as JobRequirements['seniority'] }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              >
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nivel de Inglés
              </label>
              <select
                value={requirements.englishLevel}
                onChange={(e) => setRequirements(prev => ({ ...prev, englishLevel: e.target.value as JobRequirements['englishLevel'] }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              >
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Nativo">Nativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Contrato
              </label>
              <select
                value={requirements.contractType}
                onChange={(e) => setRequirements(prev => ({ ...prev, contractType: e.target.value as JobRequirements['contractType'] }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requisitos Adicionales
              </label>
              <div className="text-sm text-yellow-600 mb-2">
                El uso de texto libre puede afectar la precisión del modelo
              </div>
              <textarea
                value={requirements.additionalRequirements || ''}
                onChange={(e) => setRequirements(prev => ({ ...prev, additionalRequirements: e.target.value }))}
                className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                placeholder="Ingrese requisitos adicionales..."
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Seniority:</span>
              <p className="text-gray-900">{requirements.seniority}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Nivel de Inglés:</span>
              <p className="text-gray-900">{requirements.englishLevel}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Tipo de Contrato:</span>
              <p className="text-gray-900">{requirements.contractType}</p>
            </div>
            {requirements.additionalRequirements && (
              <div>
                <span className="text-sm font-medium text-gray-700">Requisitos Adicionales:</span>
                <p className="text-gray-900 whitespace-pre-wrap">{requirements.additionalRequirements}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default JobDetails; 