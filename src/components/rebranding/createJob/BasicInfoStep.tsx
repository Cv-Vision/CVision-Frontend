import { CheckCircle, AlertTriangle } from 'lucide-react';

interface BasicInfoStepProps {
  title: string;
  setTitle: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  province: string;
  setProvince: (value: string) => void;
  provinces: string[];
  provincesLoading: boolean;
  provincesError: string | null;
  cities: string[];
  citiesLoading: boolean;
  citiesError: string | null;
  isValidating: boolean;
  validationResult: any;
  clearValidation: () => void;
  contractType: string;
  setContractType: (value: string) => void;
  seniority: string;
  setSeniority: (value: string) => void;
  modal: string;
  setModal: (value: string) => void;
}

export function BasicInfoStep({
  title,
  setTitle,
  company,
  setCompany,
  city,
  setCity,
  province,
  setProvince,
  provinces,
  provincesLoading,
  provincesError,
  cities,
  citiesLoading,
  citiesError,
  isValidating,
  validationResult,
  clearValidation,
  contractType,
  setContractType,
  seniority,
  setSeniority,
  modal,
  setModal,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label htmlFor="title" className="text-base font-medium text-gray-700">
            Título del Puesto *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ej. Desarrollador Full Stack Senior"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
            required
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="company" className="text-base font-medium text-gray-700">
            Empresa *
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="ej. TechCorp"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-base font-medium text-gray-700">
          Ubicación del Puesto *
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <select
              value={province}
              onChange={e => {
                setProvince(e.target.value);
                setCity(''); // Clear city when province changes
                clearValidation();
              }}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
              required
              disabled={provincesLoading}
            >
              <option value="">
                {provincesLoading ? 'Cargando provincias...' : 'Seleccionar provincia'}
              </option>
              {provinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {provincesError && (
              <p className="text-xs text-red-600 mt-1">{provincesError}</p>
            )}
          </div>
          <div className="relative">
            <select
              value={city}
              onChange={e => {
                setCity(e.target.value);
                clearValidation();
              }}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
              required
              disabled={!province || citiesLoading}
            >
              <option value="">
                {!province 
                  ? 'Seleccionar provincia primero'
                  : citiesLoading 
                  ? 'Cargando ciudades...'
                  : 'Seleccionar ciudad'
                }
              </option>
              {cities.map((cityName) => (
                <option key={cityName} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
            {citiesError && (
              <p className="text-xs text-red-600 mt-1">{citiesError}</p>
            )}
          </div>
        </div>
        
        {/* Validation feedback */}
        {(province && city && !isValidating && validationResult) && (
          <div className="flex items-center gap-2">
            {validationResult.valid ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">Ubicación válida</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">
                  {validationResult.message || validationResult.error || 'Ubicación no válida'}
                </span>
              </>
            )}
          </div>
        )}
        
        {isValidating && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-blue-700">Validando ubicación...</span>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label htmlFor="type" className="text-base font-medium text-gray-700">
            Tipo de Empleo *
          </label>
          <select
            id="type"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
          >
            <option value="">Selecciona el tipo</option>
            <option value="Full-time">Tiempo Completo</option>
            <option value="Part-time">Tiempo Parcial</option>
            <option value="Freelance">Freelance</option>
            <option value="Temporal">Contrato</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label htmlFor="experience" className="text-base font-medium text-gray-700">
            Experiencia Requerida
          </label>
          <select
            id="experience"
            value={seniority}
            onChange={(e) => setSeniority(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
          >
            <option value="">Seleccionar...</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid</option>
            <option value="Senior">Senior</option>
          </select>
        </div>
        <div className="space-y-3">
          <label htmlFor="work-mode" className="text-base font-medium text-gray-700">
            Modalidad de Trabajo
          </label>
          <select
            id="work-mode"
            value={modal}
            onChange={(e) => setModal(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
          >
            <option value="">Seleccionar...</option>
            <option value="REMOTE">Remoto</option>
            <option value="ONSITE">Presencial</option>
            <option value="HYBRID">Híbrido</option>
          </select>
        </div>
      </div>
    </div>
  );
}
