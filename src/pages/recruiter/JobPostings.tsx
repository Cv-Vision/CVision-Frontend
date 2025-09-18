import { Table, SortConfig, SortDirection } from '@/components/dashboard/Table';
import { JobRow } from '@/components/dashboard/JobPostingRow.tsx';
import { useGetJobs } from '@/hooks/useGetJobs';
import { useNavigate, useLocation } from 'react-router-dom';
import { BriefcaseIcon, PlusIcon, FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import BackButton from '@/components/other/BackButton.tsx';
import { useUpdateJobPostingData } from '@/hooks/useUpdateJobPostingData';
import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';
import { SortDropdown, SortOption } from '@/components/other/SortDropdown';

type JobStatus = 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'DELETED';
type StatusFilter = 'all' | JobStatus;

const ALL_STATUSES: JobStatus[] = ['ACTIVE', 'INACTIVE', 'CANCELLED'];

const JobPostings: React.FC = () => {
  const {jobs = [], isLoading, error, refetch} = useGetJobs();
  const nav = useNavigate();
  const location = useLocation();
  const {updateJobPostingData} = useUpdateJobPostingData();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const { showToast } = useToast();
  
  // Sorting state - supports multiple criteria
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [modalSort, setModalSort] = useState<string | null>(null);
  const [statusSort, setStatusSort] = useState<string | null>(null);

  // Prevenir scroll en toda la página
  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [showConfirm]);
  
  // Mostrar toast cuando se crea un puesto exitosamente
  useEffect(() => {
    const state = location.state as { jobCreated?: boolean; jobTitle?: string } | null;
    if (state?.jobCreated && state?.jobTitle) {
      showToast(`¡El puesto "${state.jobTitle}" se ha creado exitosamente!`, 'success');
      
      // Limpiar el estado de la ubicación para evitar que el toast aparezca al recargar
      window.history.replaceState({}, document.title);
    }
  }, [location, showToast]);

  const headers = ['Título', 'Descripción', 'Modalidad', 'Estado', 'Acciones'];
  
  // Sort options
  const modalOptions: SortOption[] = [
    { value: 'REMOTE', label: 'Remoto' },
    { value: 'HYBRID', label: 'Híbrido' },
    { value: 'ONSITE', label: 'Presencial' }
  ];
  
  const statusOptions: SortOption[] = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'INACTIVE', label: 'Inactivo' },
    { value: 'CANCELLED', label: 'Cancelado' }
  ];
  
  const sortableColumns = ['título', 'descripción', 'modalidad', 'estado'];

  const handleRowClick = (id: string) => {
    nav(`/recruiter/job/${id}`);
  };

  const handleView = (id: number) => nav(`/recruiter/job/${id}/analysis`);
  const handleEdit = (id: number) => nav(`/recruiter/edit-job/${id}`);
  const handleDelete = (id: string) => {
    setJobToDelete(id);
    setShowConfirm(true);
  };

  // Sorting handlers
  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    
    if (direction === null) {
      setSortConfig(null);
    } else {
      setSortConfig({ key, direction });
    }
  };

  const handleModalSort = (value: string | null) => {
    setModalSort(value);
  };

  const handleStatusSort = (value: string | null) => {
    setStatusSort(value);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      await updateJobPostingData(jobToDelete, { status: 'DELETED' });
      refetch(true);
      showToast('Puesto eliminado correctamente', 'success');
    } catch (err) {
      console.error('Error al eliminar:', err);
      showToast('Error al eliminar el puesto', 'error');
    }
    setShowConfirm(false);
    setJobToDelete(null);
  };

  const filteredJobs = useMemo(() => {
    // Always filter out DELETED jobs
    let visibleJobs = jobs.filter(job => job.status !== 'DELETED');
    
    // Apply status filter
    if (statusFilter !== 'all') {
      visibleJobs = visibleJobs.filter(job => job.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      visibleJobs = visibleJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    visibleJobs = [...visibleJobs].sort((a, b) => {
      
      if (sortConfig) {
        const { key, direction } = sortConfig;
        let aValue: any;
        let bValue: any;
        
        switch (key) {
          case 'título':
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case 'descripción':
            aValue = a.description.toLowerCase();
            bValue = b.description.toLowerCase();
            break;
          case 'modalidad':
            aValue = a.modal || '';
            bValue = b.modal || '';
            break;
          case 'estado':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            return 0;
        }
        
        if (aValue < bValue) {
          return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'asc' ? 1 : -1;
        }
        
      }
      
      
      if (modalSort) {
        if (a.modal === modalSort && b.modal !== modalSort) return -1;
        if (a.modal !== modalSort && b.modal === modalSort) return 1;
       
      }
      
      
      if (statusSort) {
        if (a.status === statusSort && b.status !== statusSort) return -1;
        if (a.status !== statusSort && b.status === statusSort) return 1;
      }
      
      return 0;
    });
    
    return visibleJobs;
  }, [jobs, statusFilter, searchTerm, sortConfig, modalSort, statusSort]);

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4">
        {/* Toasts globales via provider */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
            <BackButton to="/recruiter/dashboard" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <BriefcaseIcon className="h-8 w-8 text-white"/>
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    Puestos de trabajo
                  </h1>
                  <p className="text-gray-600 mt-1">Gestiona tus ofertas de empleo</p>
                </div>
              </div>
              <button
                  onClick={() => nav('/recruiter/create-job')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <PlusIcon className="h-5 w-5"/>
                <span>Crear puesto</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar puestos por título, empresa o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              {/* Status Filters */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <FunnelIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">Filtrar por estado:</span>
                </div>
                <div className="flex items-center gap-2">
                  {['all', ...ALL_STATUSES].map((status) => {
                    const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2';
                    let activeClasses = '';
                    let inactiveClasses = '';

                    switch (status) {
                      case 'ACTIVE':
                        activeClasses = 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg';
                        inactiveClasses = 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 hover:border-green-300';
                        break;
                      case 'INACTIVE':
                        activeClasses = 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg';
                        inactiveClasses = 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200 hover:border-yellow-300';
                        break;
                      case 'CANCELLED':
                        activeClasses = 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg';
                        inactiveClasses = 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 hover:border-red-300';
                        break;
                      default: // 'all'
                        activeClasses = 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg';
                        inactiveClasses = 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300';
                    }

                    // Textos de botón
                    const label = status === 'all'
                        ? 'Todos'
                        : status === 'ACTIVE'
                            ? 'Activos'
                            : status === 'INACTIVE'
                                ? 'Inactivos'
                                : 'Cancelados';

                    return (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status as StatusFilter)}
                            className={`${base} ${statusFilter === status ? activeClasses : inactiveClasses}`}
                        >
                          {label}
                        </button>
                    );
                  })}
                </div>
              </div>

              {/* Sorting Controls */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-sm font-medium">Ordenar por:</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <SortDropdown
                      options={modalOptions}
                      selectedValue={modalSort}
                      onSelect={handleModalSort}
                      placeholder="Modalidad"
                      className="min-w-[140px]"
                    />
                    <SortDropdown
                      options={statusOptions}
                      selectedValue={statusSort}
                      onSelect={handleStatusSort}
                      placeholder="Estado"
                      className="min-w-[120px]"
                    />
                  </div>
                </div>
                
                {/* Help Text */}
                <div className="text-xs text-gray-500">
                  <strong>Tip:</strong> Haz clic en los encabezados "Título" y "Descripción" para ordenar alfabéticamente. 
                  Puedes combinar múltiples criterios de ordenamiento.
                </div>
                
                {/* Active Sort Indicators */}
                {(sortConfig || modalSort || statusSort) && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500 font-medium">Ordenamiento activo:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {sortConfig && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {sortConfig.key === 'título' ? 'Título' : sortConfig.key === 'descripción' ? 'Descripción' : sortConfig.key} {sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A'}
                        </span>
                      )}
                      {modalSort && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Modalidad: {modalOptions.find(opt => opt.value === modalSort)?.label}
                        </span>
                      )}
                      {statusSort && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          Estado: {statusOptions.find(opt => opt.value === statusSort)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Mostrando <span className="font-semibold text-blue-600">{filteredJobs.length}</span> de <span className="font-semibold text-blue-600">{jobs.filter(job => job.status !== 'DELETED').length}</span> puestos
                </p>
                {(searchTerm || statusFilter !== 'all' || sortConfig || modalSort || statusSort) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setSortConfig(null);
                      setModalSort(null);
                      setStatusSort(null);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Limpiar filtros y ordenamiento
                  </button>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800">Cargando puestos de trabajo...</p>
                      <p className="text-gray-600 text-sm">Esto puede tomar unos segundos</p>
                    </div>
                  </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-red-100">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-red-800">Error al cargar puestos</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredJobs.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex flex-col items-center gap-6">
                    <div className="p-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
                      <BriefcaseIcon className="h-16 w-16 text-blue-600" />
                    </div>
                    <div className="max-w-md">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {searchTerm || statusFilter !== 'all' ? 'No se encontraron puestos' : 'No tienes puestos de trabajo'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {searchTerm || statusFilter !== 'all' 
                          ? 'Intenta ajustar tus filtros de búsqueda'
                          : 'Comienza creando tu primera publicación de empleo'
                        }
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <button
                          onClick={() => nav('/recruiter/create-job')}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <PlusIcon className="h-5 w-5" />
                          <span>Crear primer puesto</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
            )}

            {/* Table */}
            {!isLoading && !error && filteredJobs.length > 0 && (
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden shadow-lg">
                    <Table 
                      headers={headers} 
                      rows={filteredJobs.map(job =>
                        JobRow({
                          job,
                          onRowClick: handleRowClick,
                          onView: handleView,
                          onEdit: handleEdit,
                          onDelete: handleDelete,
                          isLoading
                        })
                      )}
                      sortConfig={sortConfig}
                      onSort={handleSort}
                      sortableColumns={sortableColumns}
                    />
                </div>
            )}
            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-full bg-red-100">
                      <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Confirmar eliminación</h3>
                  </div>
                  <p className="text-gray-600 mb-6">
                    ¿Estás seguro de que quieres eliminar este puesto? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 font-medium"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold flex items-center space-x-2"
                      onClick={confirmDelete}
                    >
                      <span>Eliminar</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default JobPostings;
