// TODO descomentar para agregar compensacion
/*
import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface CompensationStepProps {
  // This step is mainly for UI enhancement, keeping existing functionality
}

export function CompensationStep({}: CompensationStepProps) {
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [salaryPeriod, setSalaryPeriod] = useState('');
  const [salaryNegotiable, setSalaryNegotiable] = useState(false);

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefitToRemove: string) => {
    setBenefits(benefits.filter((benefit) => benefit !== benefitToRemove));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <label htmlFor="salary-min" className="text-base font-medium text-gray-700">
              Salario Mínimo (€)
            </label>
            <input
              id="salary-min"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="30000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="salary-max" className="text-base font-medium text-gray-700">
              Salario Máximo (€)
            </label>
            <input
              id="salary-max"
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="50000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
            />
          </div>
          <div className="space-y-3">
            <label htmlFor="salary-period" className="text-base font-medium text-gray-700">
              Período
            </label>
            <select
              id="salary-period"
              value={salaryPeriod}
              onChange={(e) => setSalaryPeriod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
            >
              <option value="">Seleccionar...</option>
              <option value="yearly">Anual</option>
              <option value="monthly">Mensual</option>
              <option value="hourly">Por hora</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="salary-negotiable"
            checked={salaryNegotiable}
            onChange={(e) => setSalaryNegotiable(e.target.checked)}
            className="h-4 w-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="salary-negotiable" className="text-base text-gray-700">
            Salario negociable
          </label>
        </div>

        <div className="space-y-4">
          <label className="text-base font-medium text-gray-700">Beneficios</label>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="ej. Seguro médico, vacaciones flexibles..."
              value={newBenefit}
              onChange={(e) => setNewBenefit(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
            />
            <button
              type="button"
              onClick={addBenefit}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar
            </button>
          </div>
          {benefits.length > 0 && (
            <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {benefit}
                  <button
                    type="button"
                    onClick={() => removeBenefit(benefit)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
*/