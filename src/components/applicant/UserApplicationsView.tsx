import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserApplications, Application } from '../../hooks/useUserApplications';
import { ApplicationHeader } from './ApplicationHeader';
import { ApplicationListSidebar } from './ApplicationListSidebar';
import { ApplicationDetails } from './ApplicationDetails';

export function UserApplicationsView() {
  const navigate = useNavigate();
  const { applications, loading, error } = useUserApplications();
  
  // New state for the modern UI
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Set first application as selected when applications are loaded
  useEffect(() => {
    if (applications.length > 0 && !selectedApplication) {
      setSelectedApplication(applications[0]);
    }
  }, [applications, selectedApplication]);

  const handleApplicationSelect = (application: Application) => {
    setSelectedApplication(application);
  };

  const handleBackClick = () => {
    navigate("/applicant/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ApplicationHeader onBackClick={handleBackClick} />
        <div className="flex h-[calc(100vh-73px)]">
          <ApplicationListSidebar
            applications={[]}
            selectedApplication={null}
            onApplicationSelect={handleApplicationSelect}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            isLoading={true}
          />
          <div className="flex-1 bg-gray-50 overflow-y-auto flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium">Cargando tus postulaciones...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <ApplicationHeader onBackClick={handleBackClick} />
        <div className="flex h-[calc(100vh-73px)]">
          <ApplicationListSidebar
            applications={[]}
            selectedApplication={null}
            onApplicationSelect={handleApplicationSelect}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            isLoading={false}
          />
          <div className="flex-1 bg-gray-50 overflow-y-auto flex items-center justify-center">
            <div className="text-center text-red-600">
              <p className="text-lg font-medium">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <ApplicationHeader onBackClick={handleBackClick} />
        <div className="flex h-[calc(100vh-73px)]">
          <ApplicationListSidebar
            applications={[]}
            selectedApplication={null}
            onApplicationSelect={handleApplicationSelect}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            isLoading={false}
          />
          <div className="flex-1 bg-gray-50 overflow-y-auto flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium">No tienes postulaciones</p>
              <p className="text-sm">Cuando te postules a un puesto, aparecerá aquí</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ApplicationHeader onBackClick={handleBackClick} />

      <div className="flex h-[calc(100vh-73px)]">
        <ApplicationListSidebar
          applications={applications}
          selectedApplication={selectedApplication}
          onApplicationSelect={handleApplicationSelect}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          isLoading={loading}
        />

        {/* Application Details */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          {selectedApplication ? (
            <ApplicationDetails application={selectedApplication} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">Selecciona una postulación para ver los detalles</p>
                <p className="text-sm">Usa los filtros para encontrar aplicaciones específicas</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}