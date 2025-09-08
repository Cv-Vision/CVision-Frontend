import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components//other/BackButton.tsx';
import { useCreateJobForm, CreateJobPayload } from '@/hooks/useCreateJobForm.ts';
import { BriefcaseIcon, PlusIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { mapSeniorityToExperienceLevel, mapEnglishLevelToAPI, mapContractTypeToAPI } from '@/utils/jobPostingMappers';

type QuestionType = 'YES_NO' | 'OPEN' | 'NUMERICAL';
interface Questions {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
}

export default function CreateJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [seniority, setSeniority] = useState<'Junior' | 'Mid' | 'Senior' | ''>('');
  const [englishLevel, setEnglishLevel] = useState<'No requerido' | 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo' | ''>('');
  const [industryRequired, setIndustryRequired] = useState(false);
  const [industryText, setIndustryText] = useState('');
  const [contractType, setContractType] = useState<'Full-time' | 'Part-time' | 'Freelance' | 'Temporal' | ''>('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [jobLocation, setJobLocation] = useState('');

  // Preguntas para aplicantes
  const [questions, setQuestions] = useState<Questions[]>([]);

  const navigate = useNavigate();

  const {
    createJob,
    isSubmitting,
    error,
    success
  } = useCreateJobForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateJobPayload = {
      title,
      description,
    };

    if (seniority) {
      const mapped = mapSeniorityToExperienceLevel(seniority);
      if (mapped) payload.experience_level = mapped as CreateJobPayload['experience_level'];
    }
    if (englishLevel) {
      const mapped = mapEnglishLevelToAPI(englishLevel);
      if (mapped) payload.english_level = mapped as CreateJobPayload['english_level'];
    }
    if (contractType) {
      const mapped = mapContractTypeToAPI(contractType);
      if (mapped) payload.contract_type = mapped as CreateJobPayload['contract_type'];
    }

    payload.industry_experience = { required: industryRequired, industry: industryRequired ? industryText : undefined };
    if (additionalRequirements.trim()) payload.additional_requirements = additionalRequirements.trim();
    if (jobLocation.trim()) payload.job_location = jobLocation.trim();

    //incluir questions solo si hay válidas
    const validQs = questions
      .map(q => ({ ...q, text: q.text.trim() }))
      .filter(q => q.text.length > 0 && (q.type === 'YES_NO' || q.type === 'OPEN' || q.type === 'NUMERICAL'));
    if (validQs.length > 0) {
      payload.questions = validQs.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        order: q.order
      }));
    }

    await createJob(payload);
  };

  useEffect(() => {
    if (success) {
      navigate('/recruiter/job-postings', { state: { jobCreated: true, jobTitle: title } });
    }
  }, [success, navigate, title]);

  const addQuestion = () => {
      const newOrder = questions.length + 1;
      setQuestions(prev => [...prev, {
        id: crypto.randomUUID(),
        text: '',
        type: 'YES_NO',
        order: newOrder
      }]);
    };

    const removeQuestion = (id: string) => {
      setQuestions(prev => {
        const filtered = prev.filter(q => q.id !== id);
        // Reordenar después de eliminar
        return filtered.map((q, index) => ({ ...q, order: index + 1 }));
      });
    };

  const updateQuestion = (id: string, patch: Partial<Questions>) =>
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, ...patch } : q)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-white/20">
        <BackButton />
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-10">
          <div className="relative">
            <BriefcaseIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Crear Nuevo Puesto
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Título */}
          <div className="space-y-3">
            <label className="block text-base font-semibold text-blue-800">
              Título del Puesto
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-2 border-blue-200 rounded-xl px-6 py-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
              placeholder="Ej: Desarrollador Frontend Senior"
              required
            />
          </div>

          {/* Descripción */}
          <div className="space-y-3">
            <label className="block text-base font-semibold text-blue-800">
              Descripción del Puesto
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-2 border-blue-200 rounded-xl px-6 py-4 text-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
              rows={8}
              placeholder="Describe las responsabilidades, requisitos y beneficios del puesto..."
              required
            />
          </div>

          {/* Nota sobre campos opcionales */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/60">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Campos opcionales</p>
                <p>Estos campos son opcionales, pero es recomendado completarlos para facilitar que los candidatos encuentren el puesto y mejorar la calidad de las coincidencias.</p>
              </div>
            </div>
          </div>

          {/* Requisitos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Seniority</label>
              <select
                value={seniority}
                onChange={e => setSeniority(e.target.value as any)}
                className="w-full text-sm border-2 border-blue-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-blue-300"
              >
                <option value="">Seleccionar...</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-green-800 mb-1">Nivel de Inglés</label>
              <select
                value={englishLevel}
                onChange={e => setEnglishLevel(e.target.value as any)}
                className="w-full text-sm border-2 border-green-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition-all duration-200 hover:border-green-300"
              >
                <option value="">Seleccionar...</option>
                <option value="No requerido">No requerido</option>
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
                <option value="Nativo">Nativo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-800 mb-1">Tipo de Contrato</label>
              <select
                value={contractType}
                onChange={e => setContractType(e.target.value as any)}
                className="w-full text-sm border-2 border-purple-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all duration-200 hover:border-purple-300"
              >
                <option value="">Seleccionar...</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Temporal">Temporal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">Ubicación del Puesto</label>
              <input
                type="text"
                value={jobLocation}
                onChange={e => setJobLocation(e.target.value)}
                className="w-full text-sm border-2 border-orange-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-all duration-200 hover:border-orange-300"
                placeholder="Ej: Buenos Aires, Madrid..."
              />
            </div>
          </div>

          {/* Industria y adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">Experiencia en Industria</label>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="checkbox"
                  checked={industryRequired}
                  onChange={e => setIndustryRequired(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 border-2 border-indigo-300 rounded focus:ring-2 focus:ring-indigo-100 focus:ring-offset-0"
                />
                <span className="text-sm text-indigo-900 font-medium">Requerida</span>
              </div>
              {industryRequired && (
                <input
                  type="text"
                  value={industryText}
                  onChange={e => setIndustryText(e.target.value)}
                  className="w-full text-sm border-2 border-indigo-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all duration-200 hover:border-indigo-300"
                  placeholder="Industria específica"
                />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 mb-1">Requisitos Adicionales</label>
              <textarea
                value={additionalRequirements}
                onChange={e => setAdditionalRequirements(e.target.value)}
                className="w-full text-sm border-2 border-blue-200 rounded-lg px-3 py-2 bg-white/80 backdrop-blur-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all duration-200 hover:border-blue-300 resize-none"
                rows={3}
                placeholder="Escribe requisitos adicionales..."
              />
            </div>
          </div>

          {/* NUEVA SECCIÓN: Preguntas para aplicantes (opcional) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Preguntas para aplicantes (opcional)</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="rounded-xl border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
              >
                + Agregar pregunta
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
                      className="text-red-600 text-sm hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                    placeholder="Ej: ¿Tenés disponibilidad full-time?"
                    className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    value={q.type}
                    onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                    className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="YES_NO">Sí / No</option>
                    <option value="OPEN">Desarrollo (respuesta libre)</option>
                    <option value="NUMERICAL">Numérica (respuesta numérica)</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <p className="text-red-600 text-base font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-600 text-base font-medium">¡Puesto creado exitosamente!</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-6 pt-6">
            <button
              type="button"
              onClick={() => navigate('/recruiter/dashboard')}
              className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all duration-300 hover:scale-105 border border-gray-200 text-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publicando...
                </>
              ) : (
                <>
                  <PlusIcon className="h-6 w-6" />
                  Publicar Puesto
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
