export enum UserRole {
    Applicant = 'applicant',
    Recruiter = 'recruiter'
}
export interface User {
    email?: string;
    name?: string;
    company?: string;
    role?: UserRole;
    token?: string;      // idToken de Cognito
    username?: string;   // derivado de claims
    [key: string]: any;
}