import { MapPin } from 'lucide-react';

interface BasicInfoStepProps {
  title: string;
  setTitle: (value: string) => void;
  company: string;
  setCompany: (value: string) => void;
  jobLocation: string;
  setJobLocation: (value: string) => void;
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
  jobLocation,
  setJobLocation,
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

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label htmlFor="location" className="text-base font-medium text-gray-700">
            Ubicación *
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              id="location"
              type="text"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
              placeholder="ej. Madrid, España"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
            />
          </div>
        </div>
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
