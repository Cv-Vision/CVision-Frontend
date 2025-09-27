import { Search, MapPin, Clock } from "lucide-react";

interface JobSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  typeFilter: string;
  onTypeChange: (value: string) => void;
}

export const JobSearchFilters = ({
  searchTerm,
  onSearchChange,
  locationFilter,
  onLocationChange,
  typeFilter,
  onTypeChange,
}: JobSearchFiltersProps) => {
  return (
    <div className="p-4 border-b space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          placeholder="Buscar trabajos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-200 focus:outline-none"
        />
      </div>

      <div className="flex space-x-2">
        <select 
          value={locationFilter} 
          onChange={(e) => onLocationChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-200 focus:outline-none"
        >
          <option value="">Todas las ubicaciones</option>
          <option value="Madrid">Madrid</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Valencia">Valencia</option>
          <option value="Sevilla">Sevilla</option>
          <option value="Bilbao">Bilbao</option>
          <option value="Málaga">Málaga</option>
        </select>

        <select 
          value={typeFilter} 
          onChange={(e) => onTypeChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-300 focus:ring-2 focus:ring-teal-200 focus:outline-none"
        >
          <option value="">Todos los tipos</option>
          <option value="FULL_TIME">Tiempo Completo</option>
          <option value="PART_TIME">Medio Tiempo</option>
          <option value="CONTRACT">Contrato</option>
          <option value="FREELANCE">Freelance</option>
          <option value="INTERNSHIP">Prácticas</option>
        </select>
      </div>
    </div>
  );
};
