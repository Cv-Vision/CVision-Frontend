export interface BasicInfo {
    email: string;
    password: string;
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
}

export interface JobSearchFilters {
    title: string;
    company?: string;
    jobType?: string;
    region?: string;
    contractType?: string;
    seniorityLevel?: string;
    industry?: string;
    modality?: string;
}
