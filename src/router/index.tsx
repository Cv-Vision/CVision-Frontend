import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import RecruiterDashboard from '../pages/recruiter/Dashboard';

import { ProtectedRoute } from '../components/other/ProtectedRoute.tsx';
import CreateJob from '../pages/recruiter/CreateJob';
import ConfirmAccount from "@/pages/auth/ConfirmAccount.tsx";
import RecruiterConfirmAccount from "@/pages/recruiter/ConfirmAccount.tsx";
import CVAnalysisResults from '../pages/recruiter/CVAnalysisResults';
import JobPostings from "@/pages/recruiter/JobPostings.tsx";
import JobPostingDetails from '../pages/recruiter/JobPostingDetails';
import RecruiterRegisterForm from "@/pages/recruiter/RegisterForm.tsx";

// Applicant related imports
import ApplicantDashboard from '@/pages/applicant/Dashboard';
import { UploadCV } from '@/pages/applicant/UploadCV';
import { ApplicantProfile } from '@/pages/applicant/Profile';
import JobListings from '@/pages/applicant/JobListings';
import ApplicantConfirmAccount from "@/pages/applicant/ConfirmAccount.tsx";
import ApplicantRegisterForm from '@/pages/applicant/RegisterForm.tsx';
import JobPosition from '@/pages/applicant/JobPosition.tsx';
import JobApplication from '@/pages/applicant/JobApplication.tsx';
import {UserApplicationsView} from "@/components/applicant/UserApplicationsView.tsx";


export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
        <Route path="/recruiter-register" element={<RecruiterRegisterForm />} />
        <Route path="/applicant-register" element={<ApplicantRegisterForm />} />
        <Route path="/applicant-confirm" element={<ApplicantConfirmAccount />} />
        <Route path="/recruiter-confirm" element={<RecruiterConfirmAccount />} />

        <Route path="/confirm" element={<ConfirmAccount />} />
      <Route path="/applicant/dashboard" element={
        <ProtectedRoute requiredRole="applicant">
          <ApplicantDashboard />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/dashboard" element={
        <ProtectedRoute requiredRole="recruiter">
          <RecruiterDashboard />
        </ProtectedRoute>
      } />
      <Route path="/upload-cv" element={
        <ProtectedRoute requiredRole="applicant">
          <UploadCV />
        </ProtectedRoute>
      } />
      <Route path="/perfil-applicant" element={
        <ProtectedRoute requiredRole="applicant">
          <ApplicantProfile />
        </ProtectedRoute>
      } />
        <Route path="/mis-postulaciones" element={
            <ProtectedRoute requiredRole="applicant">
                <UserApplicationsView />
            </ProtectedRoute>
        } />
      <Route path="/applicant/positions" element={
          <JobListings />
      } />
      <Route path="/applicant/position/:positionId" element={
          <JobPosition />
      } />
      <Route path="/position/:positionId" element={
          <JobPosition />
      } />
      <Route path="/applicant/job-application/:jobId" element={
          <ProtectedRoute requiredRole="applicant">
              <JobApplication />
          </ProtectedRoute>
      } />
      <Route path="/recruiter/create-job" element={
        <ProtectedRoute requiredRole="recruiter">
          <CreateJob />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/job-postings" element={
        <ProtectedRoute requiredRole="recruiter">
          <JobPostings />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/job/:jobId/analysis" element={
        <ProtectedRoute requiredRole="recruiter">
          <CVAnalysisResults />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/job/:jobId" element={
        <ProtectedRoute requiredRole="recruiter">
          <JobPostingDetails />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
