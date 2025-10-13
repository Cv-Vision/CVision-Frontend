import { Briefcase, FileText, Users, HelpCircle } from 'lucide-react';

const STEPS = [
  { id: 1, title: "Información Básica", icon: Briefcase, description: "Detalles principales del puesto" },
  { id: 2, title: "Descripción", icon: FileText, description: "Responsabilidades y requisitos" },
  { id: 3, title: "Habilidades", icon: Users, description: "Competencias técnicas" },
  { id: 4, title: "Preguntas", icon: HelpCircle, description: "Preguntas adicionales para candidatos" },
];

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Crear Nuevo Puesto</h1>
        <p className="text-muted-foreground">
          Paso {currentStep} de {STEPS.length}
        </p>
      </div>

      <div className="space-y-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center space-y-2 flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600"
                        : isCompleted
                          ? "bg-blue-100 text-blue-600 border-blue-600"
                          : "bg-gray-100 text-gray-400 border-gray-300"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 hidden sm:block">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
