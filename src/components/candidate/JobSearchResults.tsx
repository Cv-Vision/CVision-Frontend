const JobSearchResultsPlaceholder = ({ isLoading, hasResults }: { isLoading: boolean; hasResults: boolean }) => {
    if (isLoading) {
        return <p className="text-gray-500 text-center py-4">Cargando resultados...</p>;
    }
    if (!hasResults) {
        return <p className="text-gray-500 text-center py-4">No se encontraron resultados</p>;
    }
    return (
        <div className="bg-white rounded-xl shadow p-6">
            {/* Aquí irá tu lista real de resultados */}
            <p className="text-gray-500">Aquí se mostrarán los resultados de la búsqueda...</p>
        </div>
    );
};

export default JobSearchResultsPlaceholder;
