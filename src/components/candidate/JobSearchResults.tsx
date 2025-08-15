interface JobSearchResultsProps {
    isLoading: boolean;
    hasResults: boolean;
    onApply: (jobId: string) => void;
}

const JobSearchResults = ({ isLoading, hasResults, onApply }: JobSearchResultsProps) => {
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
                    <button
                        onClick={() => onApply("demo-job-id")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Postular
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobSearchResults;
