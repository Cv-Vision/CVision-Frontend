
interface DescriptionStepProps {
  description: string;
  setDescription: (value: string) => void;
  additionalRequirements: string;
  setAdditionalRequirements: (value: string) => void;
  isInvalid?: boolean;
}

export function DescriptionStep({
  description,
  setDescription,
  additionalRequirements,
  setAdditionalRequirements,
  isInvalid,
}: DescriptionStepProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <label htmlFor="description" className="text-base font-medium text-gray-700">
          Descripción General *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el puesto, las responsabilidades principales y el perfil ideal del candidato..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-blue-500 bg-white text-base resize-none min-h-40 ${
            isInvalid
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          required
        />
        {isInvalid ? (
          <p className="text-sm text-red-600">
            Escribir al menos 50 palabras.
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Proporciona una descripción clara y atractiva del puesto que ayude a los candidatos a entender el rol.
          </p>
        )}
      </div>

      <div className="space-y-4">
        <label htmlFor="additional-requirements" className="text-base font-medium text-gray-700">
          Requisitos Adicionales
        </label>
        <textarea
          id="additional-requirements"
          value={additionalRequirements}
          onChange={(e) => setAdditionalRequirements(e.target.value)}
          placeholder="• Experiencia con React y Node.js&#10;• Conocimientos de bases de datos&#10;• Inglés conversacional..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base resize-none min-h-32"
        />
      </div>
    </div>
  );
}
