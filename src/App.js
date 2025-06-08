import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import JobForm from './components/JobForm';
import CVAnalysis from './components/CVAnalysis';
import { JobProvider } from './context/JobContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  // In a real app, you would check if the user is authenticated
  const isAuthenticated = true; // This should come from your auth state
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <JobProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<AuthForm />} />
            <Route path="/register" element={<AuthForm />} />

            {/* Protected routes */}
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <JobForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv-analysis"
              element={
                <ProtectedRoute>
                  <CVAnalysis />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to jobs page */}
            <Route path="/" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </Layout>
      </Router>
    </JobProvider>
  );
}

export default App; 