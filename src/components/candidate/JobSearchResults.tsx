interface JobSearchResultsProps {
    isLoading: boolean;
    hasResults: boolean;
    onApply: (jobId: string) => void;
    appliedJobs: string[];
    isApplying: boolean;
    applyingJobId: string;
    isAuthenticated: boolean;
    userRole?: string;
}

const JobSearchResults = ({
    isLoading,
    hasResults,
    onApply,
    appliedJobs,
    isApplying,
    applyingJobId,
    isAuthenticated,
    userRole,
}: JobSearchResultsProps) => {
    if (isLoading) {
        return <p className="text-gray-500 text-center py-4">Cargando resultados...</p>;
    }
    if (!hasResults) {
        return <p className="text-gray-500 text-center py-4">No se encontraron resultados</p>;
    }
    return (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
            <p className="text-gray-500">Aquí se mostrarán los resultados de la búsqueda...</p>
            {hasResults && (
                <div className="flex justify-center">
                    {isAuthenticated && userRole === 'candidate' && (
                        <button
                            onClick={() => onApply("demo-job-id")}
                            disabled={appliedJobs.includes("demo-job-id") || (isApplying && applyingJobId === "demo-job-id")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {isApplying && applyingJobId === "demo-job-id"
                                ? 'Aplicando...'
                                : appliedJobs.includes("demo-job-id")
                                    ? 'Ya aplicado'
                                    : 'Aplicar'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobSearchResults;
