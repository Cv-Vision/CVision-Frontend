import { Job } from '@/context/JobContext';
import { useNavigate } from 'react-router-dom';

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
    // currentPage,
    // jobsPerPage,
    // onPageChange,
    // totalJobs,
}: JobSearchResultsProps) => {
    const navigate = useNavigate();
    if (isLoading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
                <p className="text-blue-600 text-center py-4 font-medium">Cargando resultados...</p>
            </div>
        );
    }
    if (!hasResults) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8">
                <p className="text-blue-600 text-center py-4 font-medium">No se encontraron resultados</p>
            </div>
        );
    }
    // Get current jobs for pagination
    // const indexOfLastJob = currentPage * jobsPerPage;
    // const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    // const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
    // const totalPages = Math.ceil(totalJobs / jobsPerPage);
    
    // Change page
    // const paginate = (pageNumber: number) => onPageChange(pageNumber);

    // Truncation config
    const MAX_DESCRIPTION_CHARS = 400; // adjust as needed to control preview size

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-100 p-8 space-y-6">
            {hasResults ? (
                <>
                    <div className="space-y-6">
                        {jobs.map((job) => {
                            const description = job.description || '';
                            const shouldTruncate = description.length > MAX_DESCRIPTION_CHARS;
                            const preview = shouldTruncate ? description.slice(0, MAX_DESCRIPTION_CHARS).trimEnd() + '…' : description;
                            return (
                                <div key={job.pk} className="border-b-2 border-blue-100 pb-6 last:border-0">
                                    <h3 className="text-xl font-bold text-blue-800 mb-2">{job.title}</h3>
                                    <p className="text-blue-700 font-medium mb-3">{job.company}</p>
                                    <div className="text-blue-600 text-base mb-2 whitespace-pre-line leading-relaxed">
                                        {preview}
                                    </div>
                                    {shouldTruncate && (
                                        <button
                                            onClick={() => navigate(`/position/${job.pk}`)}
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 mb-3 inline-flex items-center gap-1 group"
                                        >
                                            Leer más
                                            <span className="transition-transform group-hover:translate-x-0.5">→</span>
                                        </button>
                                    )}
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {job.experience_level && (
                                            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-sm px-3 py-1 rounded-xl border border-blue-200 font-medium">
                                                {job.experience_level}
                                            </span>
                                        )}
                                        {job.english_level && (
                                            <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-sm px-3 py-1 rounded-xl border border-green-200 font-medium">
                                                {job.english_level}
                                            </span>
                                        )}
                                        {job.contract_type && (
                                            <span className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 text-sm px-3 py-1 rounded-xl border border-purple-200 font-medium">
                                                {job.contract_type}
                                            </span>
                                        )}
                                        {job.location && (
                                            <span className="bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 text-sm px-3 py-1 rounded-xl border border-yellow-200 font-medium">
                                                {job.location}
                                            </span>
                                        )}
                                        {job.modal && (
                                            <span className="bg-gradient-to-r from-teal-100 to-teal-200 text-teal-800 text-sm px-3 py-1 rounded-xl border border-teal-200 font-medium">
                                                {job.modal}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => navigate(`/position/${job.pk}`)}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            Ver detalles
                                        </button>
                                        {isAuthenticated && userRole === 'applicant' && (
                                            <button
                                                onClick={() => onApply(job.pk)}
                                                disabled={appliedJobs.includes(job.pk) || (isApplying && applyingJobId === job.pk) || job.isApplied}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                            >
                                                {isApplying && applyingJobId === job.pk
                                                    ? 'Aplicando...'
                                                    : job.isApplied || (appliedJobs.includes(job.pk))
                                                        ? 'Ya aplicado'
                                                        : 'Aplicar'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Pagination */}
                    {/* {totalPages > 1 && (
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
                    )} */}
                </>
            ) : (
                <p className="text-gray-500 text-center py-8">No se encontraron resultados que coincidan con tus criterios de búsqueda.</p>
            )}
        </div>
    );

};

export default JobSearchResults;
