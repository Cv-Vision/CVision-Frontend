import { Search } from "lucide-react";
import { ApplicationCard } from "./ApplicationCard";
import { Application } from '../../hooks/useUserApplications';

interface ApplicationListSidebarProps {
  applications: Application[];
  selectedApplication: Application | null;
  onApplicationSelect: (application: Application) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  isLoading?: boolean;
}

export const ApplicationListSidebar = ({
  applications,
  selectedApplication,
  onApplicationSelect,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isLoading = false,
}: ApplicationListSidebarProps) => {
  const filteredApplications = applications
    .filter((application) => {
      const matchesSearch =
        application.jobPosting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.jobPosting.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Ordenar por estado: Aceptadas primero, luego Pendientes, luego Rechazadas
      const getStatusPriority = (status: string) => {
        switch (status) {
          case 'ACCEPTED':
            return 1;
          case 'PENDING':
            return 2;
          case 'REJECTED':
            return 3;
          default:
            return 4;
        }
      };

      const statusA = getStatusPriority(a.status);
      const statusB = getStatusPriority(b.status);

      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // Si tienen el mismo estado, ordenar por fecha de creación (más reciente primero)
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  if (isLoading) {
    return (
      <div className="w-96 border-r bg-white flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              placeholder="Buscar aplicaciones..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-200 focus:outline-none"
            />
          </div>

          <div className="flex space-x-2">
            <select 
              value={statusFilter} 
              onChange={(e) => onStatusChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-200 focus:outline-none"
            >
              <option value="">Todos los estados</option>
              <option value="Pending">Pendiente</option>
              <option value="Accepted">Aceptada</option>
              <option value="Rejected">Rechazada</option>
            </select>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <div className="text-center text-gray-500 py-8">Cargando aplicaciones...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 border-r bg-white flex flex-col">
      <div className="p-4 border-b space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            placeholder="Buscar aplicaciones..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-200 focus:outline-none"
          />
        </div>

        <div className="flex space-x-2">
          <select 
            value={statusFilter} 
            onChange={(e) => onStatusChange(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-200 focus:outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="ACCEPTED">Aceptada</option>
            <option value="REJECTED">Rechazada</option>
          </select>
        </div>
      </div>

      {/* Applications Count */}
      <div className="px-4 py-2 border-b bg-gray-50">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total: {filteredApplications.length}</span>
        </div>
      </div>

      {/* Applications List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          {filteredApplications.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No se encontraron aplicaciones que coincidan con los filtros.
            </div>
          ) : (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                isSelected={selectedApplication?.id === application.id}
                onClick={() => onApplicationSelect(application)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
