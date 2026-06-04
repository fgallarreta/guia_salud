import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { QuestionCard } from '../components/question-card';
import { Progress } from '../components/ui/progress';
import { 
  Thermometer, 
  HeartPulse, 
  Brain, 
  Wind,
  Droplets,
  Pill,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router';

const questions = [
  {
    id: 1,
    question: '¿Cuál es tu síntoma principal?',
    options: [
      { id: 'fever', icon: Thermometer, title: 'Fiebre', description: 'Temperatura elevada' },
      { id: 'chest-pain', icon: HeartPulse, title: 'Dolor de pecho', description: 'Molestias en el pecho' },
      { id: 'headache', icon: Brain, title: 'Dolor de cabeza', description: 'Cefalea o migraña' },
      { id: 'breathing', icon: Wind, title: 'Dificultad respiratoria', description: 'Falta de aire' },
    ],
  },
  {
    id: 2,
    question: '¿Cuándo comenzaron los síntomas?',
    options: [
      { id: 'today', icon: Droplets, title: 'Hoy', description: 'Hace menos de 24 horas' },
      { id: 'days', icon: Droplets, title: 'Hace unos días', description: 'Entre 2-7 días' },
      { id: 'week', icon: Droplets, title: 'Hace más de una semana', description: 'Más de 7 días' },
    ],
  },
  {
    id: 3,
    question: '¿Has tomado algún medicamento?',
    options: [
      { id: 'yes', icon: Pill, title: 'Sí', description: 'He tomado medicación' },
      { id: 'no', icon: Pill, title: 'No', description: 'No he tomado nada' },
    ],
  },
];

export function Evaluation() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (optionId: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionId });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to results
      navigate('/triage-result');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const selectedAnswer = answers[currentQuestion.id];
  const canProceed = selectedAnswer !== undefined;

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Pregunta {currentStep + 1} de {questions.length}
            </p>
            <h1 className="text-xl font-semibold">{currentQuestion.question}</h1>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <QuestionCard
            key={option.id}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={selectedAnswer === option.id}
            onClick={() => handleAnswer(option.id)}
          />
        ))}
      </div>

      {/* Continue button */}
      <div className="pt-4">
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full min-h-[var(--touch-target-min)]"
          size="lg"
        >
          {currentStep < questions.length - 1 ? (
            <>
              Continuar
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          ) : (
            'Ver resultado'
          )}
        </Button>
      </div>

      {/* Info note */}
      <div className="pt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Tus respuestas nos ayudan a brindarte la mejor orientación posible
        </p>
      </div>
    </div>
  );
}
