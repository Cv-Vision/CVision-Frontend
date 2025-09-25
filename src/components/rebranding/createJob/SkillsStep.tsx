
interface SkillsStepProps {
  englishLevel: string;
  setEnglishLevel: (value: string) => void;
  industryRequired: boolean;
  setIndustryRequired: (value: boolean) => void;
  industryText: string;
  setIndustryText: (value: string) => void;
}

export function SkillsStep({
  englishLevel,
  setEnglishLevel,
  industryRequired,
  setIndustryRequired,
  industryText,
  setIndustryText,
}: SkillsStepProps) {

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label htmlFor="languages" className="text-base font-medium text-gray-700">
              Nivel de Inglés
            </label>
            <select
              id="languages"
              value={englishLevel}
              onChange={(e) => setEnglishLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
            >
              <option value="">Seleccionar...</option>
              <option value="No requerido">No requerido</option>
              <option value="Básico">Básico</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Nativo">Nativo</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-base font-medium text-gray-700">
              Experiencia en Industria
            </label>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                id="industry-required"
                checked={industryRequired}
                onChange={(e) => setIndustryRequired(e.target.checked)}
                className="h-4 w-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="industry-required" className="text-sm text-gray-700 font-medium">
                Requerida
              </label>
            </div>
            {industryRequired && (
              <input
                type="text"
                value={industryText}
                onChange={(e) => setIndustryText(e.target.value)}
                placeholder="Industria específica"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
