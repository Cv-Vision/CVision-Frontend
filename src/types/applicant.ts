export interface BasicInfo {
    email: string;
    password: string;
    confirmPassword?: string;
    fullName: string;
}

export interface WorkExperience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    description?: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate?: string;
}

export interface ApplicantProfile {
    basicInfo: BasicInfo;
    workExperience: WorkExperience[];
    education: Education[];
    cvUrl?: string; // URL del CV subido
    userId?: string; // ID del usuario asociado (opcional)
}

export interface JobSearchFilters {
    title: string;
    company?: string;
    location?: string; // NEW backend partial match
    experience_level?: string; // ENUM: JUNIOR | SEMISENIOR | SENIOR
    contract_type?: string; // ENUM: FULL_TIME | PART_TIME | CONTRACT | FREELANCE | INTERNSHIP
    // ------------------------------------------------------------------
    // Deprecated legacy UI-only fields kept temporarily to avoid breakage
    // TODO: Remove these once components are refactored to only use the new ones.
    jobType?: string; // deprecated
    region?: string; // deprecated
    contractType?: string; // duplicate of contract_type (deprecated)
    seniorityLevel?: string; // duplicate of experience_level (deprecated)
    industry?: string; // deprecated (not in new search API)
    modality?: string; // deprecated (not in new search API)
}
