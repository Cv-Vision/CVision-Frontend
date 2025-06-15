import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import CandidateDashboard from '../pages/candidate/Dashboard';
import RecruiterDashboard from '../pages/recruiter/Dashboard';
import { UploadCV } from '../pages/candidate/UploadCV';
import { CandidateProfile } from '../pages/candidate/Profile';
import { RecruiterProfile } from '../pages/recruiter/Profile';
import { ProtectedRoute } from '../components/ProtectedRoute';
import JobListings from '../pages/candidate/JobListings';
import CreateJob from '../pages/recruiter/CreateJob';
import JobPostings from '../pages/recruiter/JobPostings.tsx';
import ConfirmAccount from "@/pages/auth/ConfirmAccount.tsx";
import CVAnalysisResults from '../pages/recruiter/CVAnalysisResults';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/confirm" element={<ConfirmAccount />} />
      <Route path="/candidate/dashboard" element={
        <ProtectedRoute requiredRole="candidate">
          <CandidateDashboard />
        </ProtectedRoute>
      } />
      <Route path="/recruiter/dashboard" element={
        <ProtectedRoute requiredRole="recruiter">
          <RecruiterDashboard />
        </ProtectedRoute>
      } />
      <Route path="/upload-cv" element={
        <ProtectedRoute requiredRole="candidate">
          <UploadCV />
        </ProtectedRoute>
      } />
      <Route path="/perfil-candidato" element={
        <ProtectedRoute requiredRole="candidate">
          <CandidateProfile />
        </ProtectedRoute>
      } />
      <Route path="/perfil-reclutador" element={
        <ProtectedRoute requiredRole="recruiter">
          <RecruiterProfile />
        </ProtectedRoute>
      } />
      <Route path="/candidate/positions" element={
        <ProtectedRoute requiredRole="candidate">
          <JobListings />
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
    </Routes>
  );
} 