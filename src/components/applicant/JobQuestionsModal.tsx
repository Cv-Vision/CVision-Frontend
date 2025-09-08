// src/components/applicant/JobQuestionsModal.tsx
import { useEffect, useMemo, useState } from 'react';
import {
  XMarkIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useGetJobQuestions, JobQuestion } from '@/hooks/useGetJobQuestions';

interface JobQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
}

interface QuestionAnswer {
  questionId: string;
  answer: string;
}

const TypeBadge = ({ type }: { type: JobQuestion['questionType'] }) => {
  const label =
    type === 'YES_NO' ? 'Sí/No' : type === 'NUMERICAL' ? 'Numérica' : 'Texto';
  return (
    <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-gray-600">
      {label}
    </span>
  );
};

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-xl border border-gray-200 p-4">
        <div className="mb-3 h-4 w-40 rounded bg-gray-200" />
        <div className="h-10 w-full rounded border bg-gray-100" />
      </div>
    ))}
  </div>
);

export default function JobQuestionsModal({
                                            isOpen,
                                            onClose,
                                            jobId,
                                            jobTitle
                                          }: JobQuestionsModalProps) {
  const [currentTab, setCurrentTab] = useState<'intro' | 'questions'>('intro');
  const [, setHasConfirmed] = useState(false);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const { questions, isLoading, error, fetchQuestions } = useGetJobQuestions();

  // Reset al abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentTab('intro');
      setHasConfirmed(false);
      setAnswers([]);
    }
  }, [isOpen]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const idx = prev.findIndex(a => a.questionId === questionId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], answer };
        return copy;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const answersMap = useMemo(
    () =>
      answers.reduce<Record<string, string>>((acc, a) => {
        acc[a.questionId] = a.answer;
        return acc;
      }, {}),
    [answers]
  );

  const handleProceedToQuestions = () => {
    setHasConfirmed(true);
    setCurrentTab('questions');     // animación fluida; se ve el loader adentro
    fetchQuestions(jobId);
  };

  const handleSkip = () => {
    // Si preferís no cerrar, podés dejar un noop o trackear "saltado".
    onClose();
  };

  const handleBackToIntro = () => {
    setCurrentTab('intro');
  };

  const onSubmit = async () => {
    // TODO: POST al backend si corresponde
    console.log('Respuestas:', answers);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 p-4 sm:p-6">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="h-6 w-6 text-indigo-600" />
            <div>
              <h3 className="text-base font-semibold">Responde las preguntas</h3>
              <p className="text-xs text-gray-500">{jobTitle ?? '—'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 px-5 pt-3 pb-1">
          <span
            className={
              'h-2 w-2 rounded-full ' +
              (currentTab === 'intro' ? 'bg-indigo-600' : 'bg-gray-300')
            }
          />
          <span
            className={
              'h-2 w-2 rounded-full ' +
              (currentTab === 'questions' ? 'bg-indigo-600' : 'bg-gray-300')
            }
          />
        </div>

        {/* Slides container */}
        <div className="relative overflow-hidden" style={{ height: 'calc(90vh - 140px)' }}>
          <div
            className="flex h-full transition-transform duration-500 ease-in-out transform-gpu will-change-transform"
            style={{
              width: '200%',
              transform: currentTab === 'intro' ? 'translateX(0%)' : 'translateX(-50%)'
            }}
          >
            {/* ---------- INTRO SLIDE (re-diseñado) ---------- */}
            <div className="w-1/2 flex-shrink-0 overflow-y-auto px-5 pb-6">
              <div className="pt-4">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {/* Banner degradado */}
                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 px-5 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <ClipboardDocumentCheckIcon className="h-6 w-6" />
                      <div>
                        <h4 className="text-sm font-semibold">
                          ¿Querés completar preguntas para este puesto?
                        </h4>
                        <p className="text-[12px] opacity-90">
                          Te tomarán sólo unos minutos y ayudan al reclutador a conocerte mejor.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bullets / beneficios */}
                  <div className="px-5 py-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="flex items-start gap-2 rounded-xl border border-gray-200 p-3">
                        <QuestionMarkCircleIcon className="mt-0.5 h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Opcionales</p>
                          <p className="text-xs text-gray-600">
                            Respondé sólo las que quieras.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 rounded-xl border border-gray-200 p-3">
                        <ClockIcon className="mt-0.5 h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Rápidas</p>
                          <p className="text-xs text-gray-600">
                            Menos de 3–5 minutos en promedio.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 rounded-xl border border-gray-200 p-3">
                        <ShieldCheckIcon className="mt-0.5 h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Privadas</p>
                          <p className="text-xs text-gray-600">
                            Sólo el equipo de reclutamiento puede verlas.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Aviso */}
                    <div className="mt-4 flex items-start gap-3 rounded-xl bg-amber-50 p-4">
                      <QuestionMarkCircleIcon className="mt-0.5 h-5 w-5 text-amber-600" />
                      <p className="text-sm text-amber-800">
                        <strong>Todas las preguntas son opcionales.</strong> Podés
                        omitirlas ahora y volver más tarde.
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="mt-6 flex flex-col items-stretch justify-end gap-3 sm:flex-row">
                      <button
                        onClick={handleSkip}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        No, ahora no
                      </button>
                      <button
                        onClick={handleProceedToQuestions}
                        className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                      >
                        Sí, quiero responder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------- QUESTIONS SLIDE ---------- */}
            <div className="w-1/2 flex-shrink-0 overflow-y-auto px-5 pb-6">
              <div className="flex items-center gap-2 py-4">
                <button
                  onClick={handleBackToIntro}
                  className="mr-1 inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Volver
                </button>
                <h4 className="text-sm font-semibold text-gray-800">Preguntas del puesto</h4>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {isLoading ? (
                <Skeleton />
              ) : questions.length === 0 ? (
                <div className="rounded-xl border border-gray-200 p-6 text-center text-sm text-gray-500">
                  Este puesto no tiene preguntas configuradas.
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <QuestionItem
                      key={q.id}
                      q={q}
                      index={idx + 1}
                      value={answersMap[q.id] ?? ''}
                      onChange={handleAnswerChange}
                    />
                  ))}
                </div>
              )}

              {/* Footer submit */}
              <div className="sticky bottom-0 mt-6 border-t border-gray-200 bg-white py-4">
                <div className="flex justify-end">
                  <button
                    onClick={onSubmit}
                    className="rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white hover:bg-green-700"
                  >
                    Enviar respuestas
                  </button>
                </div>
              </div>
            </div>
            {/* ---------- /QUESTIONS SLIDE ---------- */}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Item de pregunta por tipo ---------- */
function QuestionItem({
                        q,
                        index,
                        value,
                        onChange
                      }: {
  q: JobQuestion;
  index: number;
  value: string;
  onChange: (id: string, val: string) => void;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="mb-2 flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border bg-white text-xs font-semibold text-gray-700">
          {index}
        </span>
        <div className="flex-1">
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-900">{q.question}</p>
            <TypeBadge type={q.questionType} />
          </div>
        </div>
      </div>

      {q.questionType === 'YES_NO' ? (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onChange(q.id, 'YES')}
            className={
              'rounded-lg border px-4 py-2 text-sm ' +
              (value === 'YES'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50')
            }
          >
            Sí
          </button>
          <button
            type="button"
            onClick={() => onChange(q.id, 'NO')}
            className={
              'rounded-lg border px-4 py-2 text-sm ' +
              (value === 'NO'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50')
            }
          >
            No
          </button>
        </div>
      ) : q.questionType === 'NUMERICAL' ? (
        <input
          type="number"
          inputMode="numeric"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Ingresá un número (opcional)"
          value={value}
          onChange={e => onChange(q.id, e.target.value)}
        />
      ) : (
        <textarea
          rows={3}
          className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Tu respuesta (opcional)"
          value={value}
          onChange={e => onChange(q.id, e.target.value)}
        />
      )}
    </div>
  );
}
