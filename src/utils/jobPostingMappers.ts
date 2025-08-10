// Mapping utilities for converting between UI values and API enum values

export const seniorityMap: Record<string, string> = {
  'Junior': 'JUNIOR',
  'Mid': 'SEMISENIOR', 
  'Senior': 'SENIOR'
};

export const englishLevelMap: Record<string, string> = {
  'No requerido': 'NOT_REQUIRED',
  'Básico': 'BASIC',
  'Intermedio': 'INTERMEDIATE',
  'Avanzado': 'ADVANCED',
  'Nativo': 'NATIVE'
};

export const contractTypeMap: Record<string, string> = {
  'Full-time': 'FULL_TIME',
  'Part-time': 'PART_TIME', 
  'Freelance': 'FREELANCE',
  'Temporal': 'CONTRACT'
};

// Reverse mappings for display
export const seniorityDisplayMap: Record<string, string> = {
  'JUNIOR': 'Junior',
  'SEMISENIOR': 'Mid', 
  'SENIOR': 'Senior'
};

export const englishLevelDisplayMap: Record<string, string> = {
  'NOT_REQUIRED': 'No requerido',
  'BASIC': 'Básico',
  'INTERMEDIATE': 'Intermedio',
  'ADVANCED': 'Avanzado',
  'NATIVE': 'Nativo'
};

export const contractTypeDisplayMap: Record<string, string> = {
  'FULL_TIME': 'Full-time',
  'PART_TIME': 'Part-time', 
  'FREELANCE': 'Freelance',
  'CONTRACT': 'Temporal'
};

// Helper function to map UI seniority to API experience_level
export const mapSeniorityToExperienceLevel = (seniority: string): string | undefined => {
  return seniorityMap[seniority];
};

// Helper function to map UI english level to API english_level
export const mapEnglishLevelToAPI = (englishLevel: string): string | undefined => {
  return englishLevelMap[englishLevel];
};

// Helper function to map UI contract type to API contract_type
export const mapContractTypeToAPI = (contractType: string): string | undefined => {
  return contractTypeMap[contractType];
};

// Helper function to map API experience_level to UI display
export const mapExperienceLevelToDisplay = (experienceLevel: string): string | undefined => {
  return seniorityDisplayMap[experienceLevel];
};

// Helper function to map API english_level to UI display
export const mapEnglishLevelToDisplay = (englishLevel: string): string | undefined => {
  return englishLevelDisplayMap[englishLevel];
};

// Helper function to map API contract_type to UI display
export const mapContractTypeToDisplay = (contractType: string): string | undefined => {
  return contractTypeDisplayMap[contractType];
};

// Helper function to map ExtraRequirements to API payload
export const mapExtraRequirementsToPayload = (extraRequirements: any) => {
  const payload: Record<string, any> = {};

  // Map seniority (experience_level)
  if (extraRequirements.seniority?.length > 0) {
    const selectedSeniority = extraRequirements.seniority[0];
    const mappedSeniority = mapSeniorityToExperienceLevel(selectedSeniority);
    if (mappedSeniority) {
      payload.experience_level = mappedSeniority;
    }
  }

  // Map english level
  if (extraRequirements.englishLevel) {
    const mappedEnglishLevel = mapEnglishLevelToAPI(extraRequirements.englishLevel);
    if (mappedEnglishLevel) {
      payload.english_level = mappedEnglishLevel;
    }
  }

  // Map industry experience
  if (extraRequirements.industryRequired !== undefined) {
    payload.industry_experience = {
      required: extraRequirements.industryRequired,
      industry: extraRequirements.industryRequired ? extraRequirements.industryText : undefined
    };
  }

  // Map contract type
  if (extraRequirements.contractTypes?.length > 0) {
    const selectedContractType = extraRequirements.contractTypes[0];
    const mappedContractType = mapContractTypeToAPI(selectedContractType);
    if (mappedContractType) {
      payload.contract_type = mappedContractType;
    }
  }

  // Map additional requirements
  if (extraRequirements.freeText?.trim()) {
    payload.additional_requirements = extraRequirements.freeText.trim();
  }

  // Map location (using alias since 'location' is a reserved keyword in DynamoDB)
  if (extraRequirements.location?.trim()) {
    payload.job_location = extraRequirements.location.trim();
  }

  return payload;
}; 