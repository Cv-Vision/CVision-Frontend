import { Job } from '@/context/JobContext';

export interface JobSearchResultsProps {
    isLoading: boolean;
    hasResults: boolean;
    jobs: Job[];
    onApply: (jobId: string) => void;
    appliedJobs: string[];
    isApplying: boolean;
    applyingJobId: string;
    isAuthenticated: boolean;
    userRole?: string;
    currentPage: number;
    jobsPerPage: number;
    onPageChange: (page: number) => void;
    totalJobs: number;
}

const JobSearchResults = ({
    isLoading,
    hasResults,
    jobs,
    onApply,
    appliedJobs,
    isApplying,
    applyingJobId,
    isAuthenticated,
    userRole,
    currentPage,
    jobsPerPage,
    onPageChange,
    totalJobs,
}: JobSearchResultsProps) => {
    if (isLoading) {
        return <p className="text-gray-500 text-center py-4">Cargando resultados...</p>;
    }
    if (!hasResults) {
        return <p className="text-gray-500 text-center py-4">No se encontraron resultados</p>;
    }
    // Get current jobs for pagination
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(totalJobs / jobsPerPage);
    
    // Change page
    const paginate = (pageNumber: number) => onPageChange(pageNumber);
    
    return (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
            {hasResults ? (
                <>
                    <div className="space-y-6">
                        {currentJobs.map((job) => (
                            <div key={job.pk} className="border-b pb-4 last:border-0">
                                <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                                <p className="text-gray-600 mb-2">{job.company}</p>
                                <p className="text-gray-500 text-sm mb-4">{job.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {job.experience_level && (
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                            {job.experience_level}
                                        </span>
                                    )}
                                    {job.english_level && (
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                            {job.english_level}
                                        </span>
                                    )}
                                    {job.contract_type && (
                                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                            {job.contract_type}
                                        </span>
                                    )}
                                    {job.location && (
                                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                            {job.location}
                                        </span>
                                    )}
                                </div>
                                {isAuthenticated && userRole === 'candidate' && (
                                    <button
                                        onClick={() => onApply(job.pk)}
                                        disabled={appliedJobs.includes(job.pk) || (isApplying && applyingJobId === job.pk)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isApplying && applyingJobId === job.pk
                                            ? 'Aplicando...'
                                            : appliedJobs.includes(job.pk)
                                                ? 'Ya aplicado'
                                                : 'Aplicar'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-6">
                            <nav className="flex items-center gap-1">
                                <button 
                                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                                >
                                    &laquo;
                                </button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => paginate(index + 1)}
                                        className={`px-3 py-1 rounded border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded border hover:bg-gray-100 disabled:opacity-50"
                                >
                                    &raquo;
                                </button>
                            </nav>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500 text-center py-8">No se encontraron resultados que coincidan con tus criterios de búsqueda.</p>
            )}
        </div>
    );

};

export default JobSearchResults;
