import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { useCreateJobForm, CreateJobPayload } from '@/hooks/useCreateJobForm';
import { mapSeniorityToExperienceLevel, mapEnglishLevelToAPI, mapContractTypeToAPI } from '@/utils/jobPostingMappers';
import { useToast } from '@/context/ToastContext';
import { useGetProvinces } from '@/hooks/useGetProvinces';
import { useGetCities } from '@/hooks/useGetCity';
import { useValidateLocation } from '@/hooks/useValidateLocation';
import { ProgressIndicator } from './ProgressIndicator';
import { BasicInfoStep } from './BasicInfoStep';
import { DescriptionStep } from './DescriptionStep';
import { SkillsStep } from './SkillsStep';
import { QuestionsStep } from './QuestionsStep';
// TODO descomentar para agregar compensacion
// import { CompensationStep } from './CompensationStep';

type QuestionType = 'YES_NO' | 'OPEN' | 'NUMERICAL';
interface Questions {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
}

const STEPS = [
  { id: 1, title: "Información Básica", description: "Detalles principales del puesto" },
  { id: 2, title: "Descripción", description: "Responsabilidades y requisitos" },
  { id: 3, title: "Habilidades", description: "Competencias técnicas" },
  { id: 4, title: "Preguntas", description: "Preguntas adicionales para candidatos" },
  // TODO descomentar para agregar compensacion
  // { id: 5, title: "Compensación", description: "Salario y beneficios" },
];

export function CreateJobForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  
  // Form state - maintaining all existing functionality
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [company, setCompany] = useState('');
  const [seniority, setSeniority] = useState<'Junior' | 'Mid' | 'Senior' | ''>('');
  const [englishLevel, setEnglishLevel] = useState<'No requerido' | 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo' | ''>('');
  const [industryRequired, setIndustryRequired] = useState(false);
  const [industryText, setIndustryText] = useState('');
  const [contractType, setContractType] = useState<'Full-time' | 'Part-time' | 'Freelance' | 'Temporal' | ''>('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [modal, setModal] = useState<'REMOTE' | 'ONSITE' | 'HYBRID' | ''>('');
  const [questions, setQuestions] = useState<Questions[]>([]);

  const navigate = useNavigate();
  const { createJob, isSubmitting, success } = useCreateJobForm();
  const { showToast } = useToast();

  // Location hooks
  const { provinces, isLoading: provincesLoading, error: provincesError } = useGetProvinces();
  const { cities, isLoading: citiesLoading, error: citiesError } = useGetCities(province);
  const { isValidating, validationResult, validateLocation, clearValidation } = useValidateLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // El submit se maneja directamente en el botón "Publicar Puesto"
    // Esto previene el submit automático del formulario
  };

  const handlePublishClick = async () => {
    setIsSubmittingForm(true);
    
    // Check location validation before submitting
    if (province && city && validationResult && !validationResult.valid) {
      showToast('Por favor, selecciona una ubicación válida', 'error');
      setIsSubmittingForm(false);
      return;
    }
    
    // Crear el payload directamente aquí
    const payload: CreateJobPayload = {
      title,
      description,
      province: province.trim() || 'Buenos Aires', // Default fallback
      city: city.trim() || 'Buenos Aires', // Default fallback
    };

    if (company) payload.company = company;
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
    if (modal) {
      payload.modal = modal;
    }

    payload.industry_experience = { required: industryRequired, industry: industryRequired ? industryText : undefined };
    if (additionalRequirements.trim()) payload.additional_requirements = additionalRequirements.trim();

    // Include questions only if there are valid ones
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
      showToast('¡Puesto creado exitosamente!', 'success');
      navigate('/recruiter/dashboard', { state: { jobCreated: true, jobTitle: title } });
    }
  }, [success, navigate, title, showToast]);

  // Validate location when both province and city are selected
  useEffect(() => {
    if (province && city) {
      const timer = setTimeout(() => {
        validateLocation(province, city);
      }, 500); // Debounce validation to avoid excessive API calls

      return () => clearTimeout(timer);
    }
  }, [province, city, validateLocation]);

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            title={title}
            setTitle={setTitle}
            company={company}
            setCompany={setCompany}
            city={city}
            setCity={setCity}
            province={province}
            setProvince={setProvince}
            provinces={provinces}
            provincesLoading={provincesLoading}
            provincesError={provincesError}
            cities={cities}
            citiesLoading={citiesLoading}
            citiesError={citiesError}
            isValidating={isValidating}
            validationResult={validationResult}
            clearValidation={clearValidation}
            contractType={contractType}
            setContractType={(value) => setContractType(value as any)}
            seniority={seniority}
            setSeniority={(value) => setSeniority(value as any)}
            modal={modal}
            setModal={(value) => setModal(value as any)}
          />
        );
      case 2:
        return (
          <DescriptionStep
            description={description}
            setDescription={setDescription}
            additionalRequirements={additionalRequirements}
            setAdditionalRequirements={setAdditionalRequirements}
          />
        );
      case 3:
        return (
          <SkillsStep
            englishLevel={englishLevel}
            setEnglishLevel={(value) => setEnglishLevel(value as any)}
            industryRequired={industryRequired}
            setIndustryRequired={setIndustryRequired}
            industryText={industryText}
            setIndustryText={setIndustryText}
          />
        );
      case 4:
        return (
          <QuestionsStep
            questions={questions}
            setQuestions={setQuestions}
          />
        );
      // TODO descomentar para agregar compensacion
      // case 5:
      //   return <CompensationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProgressIndicator currentStep={currentStep} />

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg min-h-[600px]">
        <div className="p-8">
          <div className="mb-8">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-gray-800">
              {React.createElement(STEPS[currentStep - 1].title === "Información Básica" ? Briefcase : 
                STEPS[currentStep - 1].title === "Descripción" ? Briefcase :
                STEPS[currentStep - 1].title === "Habilidades" ? Briefcase :
                STEPS[currentStep - 1].title === "Preguntas" ? HelpCircle :
                STEPS[currentStep - 1].title === "Compensación" ? Briefcase :
                Briefcase, { className: "h-6 w-6 text-blue-600" })}
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-gray-600 mt-2">{STEPS[currentStep - 1].description}</p>
          </div>

          <div className="space-y-8 pb-8">
            {renderStepContent()}
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t bg-gray-50 px-8 py-6 rounded-b-lg">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </button>
            )}
          </div>

          <div className="flex gap-3">

            {currentStep === STEPS.length ? (
              <button
                type="button"
                onClick={handlePublishClick}
                disabled={isSubmitting || isSubmittingForm}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isSubmittingForm ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publicando...
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4" />
                    Publicar Puesto
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-base flex items-center gap-2"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
