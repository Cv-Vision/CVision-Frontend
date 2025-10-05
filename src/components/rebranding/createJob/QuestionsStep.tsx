import { Plus, Trash2, CheckCircle, HelpCircle } from 'lucide-react';

type QuestionType = 'YES_NO' | 'OPEN' | 'NUMERICAL';

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
}

interface QuestionsStepProps {
  questions: Question[];
  setQuestions: (questions: Question[] | ((prev: Question[]) => Question[])) => void;
}

export function QuestionsStep({ questions, setQuestions }: QuestionsStepProps) {
  const addQuestion = () => {
    const newOrder = questions.length + 1;
    setQuestions((prev: Question[]) => [...prev, {
      id: crypto.randomUUID(),
      text: '',
      type: 'YES_NO' as QuestionType,
      order: newOrder
    }]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev: Question[]) => {
      const filtered = prev.filter((q: Question) => q.id !== id);
      // Reordenar después de eliminar
      return filtered.map((q: Question, index: number) => ({ ...q, order: index + 1 }));
    });
  };

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setQuestions((prev: Question[]) => prev.map((q: Question) => (q.id === id ? { ...q, ...patch } : q)));


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-teal-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Preguntas Adicionales</h3>
        <p className="text-gray-600 leading-relaxed">
          Agrega preguntas personalizadas que te ayuden a conocer mejor a los candidatos.
        </p>
      </div>

      {/* Info box */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-teal-900 mb-2">¿Por qué agregar preguntas?</h4>
            <ul className="text-sm text-teal-800 space-y-1">
              <li>• Te ayuda a evaluar candidatos de manera más específica</li>
              <li>• Puedes conocer mejor la experiencia y motivación de los candidatos</li>
              <li>• Las preguntas son completamente opcionales</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Questions section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Preguntas para aplicantes (opcional)</h3>
          <button
            type="button"
            onClick={addQuestion}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar pregunta
          </button>
        </div>

        {questions.length === 0 && (
          <p className="text-sm text-gray-500">No agregaste preguntas.</p>
        )}

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="border rounded-lg p-4 space-y-3 hover:border-gray-300">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Pregunta #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="text-red-600 text-sm hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </button>
              </div>
              <input
                type="text"
                value={q.text}
                onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                placeholder="Ej: ¿Tenés disponibilidad full-time?"
                className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
              <div>
                <label className="text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={q.type}
                  onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 mt-1"
                >
                  <option value="YES_NO">Sí / No</option>
                  <option value="OPEN">Desarrollo (respuesta libre)</option>
                  <option value="NUMERICAL">Numérica (respuesta numérica)</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional note */}
      {questions.length > 0 && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-teal-900 mb-1">Recordatorio</h4>
              <p className="text-sm text-teal-800">
                Las preguntas son completamente opcionales para los candidatos. 
                Pueden omitir responderlas si lo desean.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
