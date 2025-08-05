import React, { useState, useEffect } from 'react';
import { UserIcon, LanguageIcon, BriefcaseIcon, MapPinIcon, BuildingOfficeIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { mapExperienceLevelToDisplay, mapEnglishLevelToDisplay, mapContractTypeToDisplay, mapSeniorityToExperienceLevel, mapEnglishLevelToAPI, mapContractTypeToAPI } from '@/utils/jobPostingMappers';

interface JobRequirementsDisplayProps {
  job: {
    experience_level?: string;
    english_level?: string;
    contract_type?: string;
    location?: string;
    job_location?: string;
    industry_experience?: {
      required: boolean;
      industry?: string;
    };
    additional_requirements?: string;
  };
  onUpdate?: (updates: any) => void;
  canEdit?: boolean;
}

const JobRequirementsDisplay: React.FC<JobRequirementsDisplayProps> = ({ job, onUpdate, canEdit = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    seniority: job.experience_level ? mapExperienceLevelToDisplay(job.experience_level) || job.experience_level : '',
    englishLevel: job.english_level ? mapEnglishLevelToDisplay(job.english_level) || job.english_level : '',
    contractType: job.contract_type ? mapContractTypeToDisplay(job.contract_type) || job.contract_type : '',
    location: job.job_location || '',
    industryRequired: job.industry_experience?.required || false,
    industryText: job.industry_experience?.industry || '',
    additionalRequirements: job.additional_requirements || ''
  });

  useEffect(() => {
    setFormData({
      seniority: job.experience_level ? mapExperienceLevelToDisplay(job.experience_level) || job.experience_level : '',
      englishLevel: job.english_level ? mapEnglishLevelToDisplay(job.english_level) || job.english_level : '',
      contractType: job.contract_type ? mapContractTypeToDisplay(job.contract_type) || job.contract_type : '',
      location: job.job_location || '',
      industryRequired: job.industry_experience?.required || false,
      industryText: job.industry_experience?.industry || '',
      additionalRequirements: job.additional_requirements || ''
    });
  }, [job]);

  const handleSave = () => {
    if (onUpdate) {
      const updates: any = {};
      
      if (formData.seniority) {
        const mappedSeniority = mapSeniorityToExperienceLevel(formData.seniority);
        if (mappedSeniority) updates.experience_level = mappedSeniority;
      }
      
      if (formData.englishLevel) {
        const mappedEnglishLevel = mapEnglishLevelToAPI(formData.englishLevel);
        if (mappedEnglishLevel) updates.english_level = mappedEnglishLevel;
      }
      
      if (formData.contractType) {
        const mappedContractType = mapContractTypeToAPI(formData.contractType);
        if (mappedContractType) updates.contract_type = mappedContractType;
      }
      
      if (formData.location) {
        updates.job_location = formData.location;
      }
      
      updates.industry_experience = {
        required: formData.industryRequired,
        industry: formData.industryRequired ? formData.industryText : undefined
      };
      
      if (formData.additionalRequirements) {
        updates.additional_requirements = formData.additionalRequirements;
      }
      
      // Call onUpdate with the updates
      onUpdate(updates);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      seniority: job.experience_level ? mapExperienceLevelToDisplay(job.experience_level) || job.experience_level : '',
      englishLevel: job.english_level ? mapEnglishLevelToDisplay(job.english_level) || job.english_level : '',
      contractType: job.contract_type ? mapContractTypeToDisplay(job.contract_type) || job.contract_type : '',
      location: job.job_location || '',
      industryRequired: job.industry_experience?.required || false,
      industryText: job.industry_experience?.industry || '',
      additionalRequirements: job.additional_requirements || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="space-y-4">
            {/* Seniority */}
            {job.experience_level && (
              <div className="flex items-center gap-4">
                <div className="p-1.5 rounded-full bg-blue-100 flex-shrink-0">
                  <UserIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-blue-700">Seniority</p>
                  {isEditing ? (
                    <select
                      value={formData.seniority}
                      onChange={(e) => setFormData(prev => ({ ...prev, seniority: e.target.value }))}
                      className="w-full text-sm border-2 border-blue-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-blue-300"
                    >
                      <option value="Junior">Junior</option>
                      <option value="Mid">Mid</option>
                      <option value="Senior">Senior</option>
                    </select>
                  ) : (
                    <p className="text-blue-900 font-semibold text-sm truncate">
                      {mapExperienceLevelToDisplay(job.experience_level) || job.experience_level}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* English Level */}
            {job.english_level && (
              <div className="flex items-center gap-4">
                <div className="p-1.5 rounded-full bg-green-100 flex-shrink-0">
                  <LanguageIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-green-700">Nivel de Inglés</p>
                  {isEditing ? (
                    <select
                      value={formData.englishLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, englishLevel: e.target.value }))}
                      className="w-full text-sm border-2 border-green-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all duration-200 hover:border-green-300"
                    >
                      <option value="No requerido">No requerido</option>
                      <option value="Básico">Básico</option>
                      <option value="Intermedio">Intermedio</option>
                      <option value="Avanzado">Avanzado</option>
                      <option value="Nativo">Nativo</option>
                    </select>
                  ) : (
                    <p className="text-green-900 font-semibold text-sm truncate">
                      {mapEnglishLevelToDisplay(job.english_level) || job.english_level}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* Contract Type */}
            {job.contract_type && (
              <div className="flex items-center gap-4">
                <div className="p-1.5 rounded-full bg-purple-100 flex-shrink-0">
                  <BriefcaseIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-purple-700">Tipo de Contrato</p>
                  {isEditing ? (
                    <select
                      value={formData.contractType}
                      onChange={(e) => setFormData(prev => ({ ...prev, contractType: e.target.value }))}
                      className="w-full text-sm border-2 border-purple-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all duration-200 hover:border-purple-300"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Pasantía">Pasantía</option>
                    </select>
                  ) : (
                    <p className="text-purple-900 font-semibold text-sm truncate">
                      {mapContractTypeToDisplay(job.contract_type) || job.contract_type}
                    </p>
                  )}
                </div>
              </div>
            )}
            {/* Puedes agregar aquí más campos si es necesario */}
          </div>
        </div>
        {canEdit && (
          <div className="flex gap-2 ml-4 mt-1">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              >
                <PencilIcon className="h-4 w-4 text-blue-600" />
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="p-1.5 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
                >
                  <CheckIcon className="h-4 w-4 text-green-600" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-1.5 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4 text-red-600" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Job Location */}
      {job.job_location && (
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-orange-100 flex-shrink-0">
            <MapPinIcon className="h-4 w-4 text-orange-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-orange-700">Ubicación del Puesto</p>
            {isEditing ? (
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full text-sm border-2 border-orange-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 hover:border-orange-300"
                placeholder="Ej: Buenos Aires, Madrid..."
              />
            ) : (
              <p className="text-orange-900 font-semibold text-sm truncate">{job.job_location}</p>
            )}
          </div>
        </div>
      )}

      {/* Industry Experience */}
      {job.industry_experience && (
        <div className="flex items-start gap-3 mt-4">
          <div className="p-1.5 rounded-full bg-indigo-100 flex-shrink-0 mt-0.5">
            <BuildingOfficeIcon className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-indigo-700">Experiencia en Industria</p>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.industryRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, industryRequired: e.target.checked }))}
                    className="h-4 w-4 text-indigo-600 border-2 border-indigo-300 rounded focus:ring-2 focus:ring-indigo-100 focus:ring-offset-0"
                  />
                  <span className="text-xs text-indigo-900 font-medium">Requerida</span>
                </div>
                {formData.industryRequired && (
                  <input
                    type="text"
                    value={formData.industryText}
                    onChange={(e) => setFormData(prev => ({ ...prev, industryText: e.target.value }))}
                    className="w-full text-sm border-2 border-indigo-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 hover:border-indigo-300"
                    placeholder="Industria específica"
                  />
                )}
              </div>
            ) : (
              <p className="text-indigo-900 font-semibold text-sm">
                {job.industry_experience.required ? 'Requerida' : 'No requerida'}
                {job.industry_experience.required && job.industry_experience.industry && (
                  <span className="block text-xs text-indigo-700 mt-1">
                    {job.industry_experience.industry}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Additional Requirements */}
      {job.additional_requirements && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Requisitos Adicionales</h3>
          {isEditing ? (
            <textarea
              value={formData.additionalRequirements}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalRequirements: e.target.value }))}
              className="w-full text-xs border-2 border-blue-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-blue-300 resize-none"
              rows={3}
              placeholder="Requisitos adicionales..."
            />
          ) : (
            <p className="text-blue-900 text-xs whitespace-pre-wrap bg-white/50 p-3 rounded-xl border border-blue-100 max-h-32 overflow-y-auto">
              {job.additional_requirements}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobRequirementsDisplay; 