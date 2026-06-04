import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Question {
  id: number;
  question: string;
  options: { label: string; value: string; severity?: number }[];
}

interface EvaluationScreenProps {
  onBack: () => void;
  onComplete: (score: number) => void;
}

const questions: Question[] = [
  {
    id: 1,
    question: "¿Cuál es tu síntoma principal?",
    options: [
      { label: "Dolor de cabeza", value: "headache", severity: 2 },
      { label: "Fiebre alta", value: "fever", severity: 4 },
      { label: "Dolor de pecho", value: "chest_pain", severity: 8 },
      { label: "Malestar general", value: "general", severity: 1 },
    ],
  },
  {
    id: 2,
    question: "¿Desde cuándo tienes estos síntomas?",
    options: [
      { label: "Menos de 24 horas", value: "less_24h", severity: 1 },
      { label: "1-3 días", value: "1_3_days", severity: 2 },
      { label: "Más de 3 días", value: "more_3_days", severity: 3 },
      { label: "Más de una semana", value: "week", severity: 4 },
    ],
  },
  {
    id: 3,
    question: "¿Qué intensidad tiene tu malestar?",
    options: [
      { label: "Leve (1-3)", value: "mild", severity: 1 },
      { label: "Moderado (4-6)", value: "moderate", severity: 3 },
      { label: "Intenso (7-8)", value: "severe", severity: 6 },
      { label: "Muy intenso (9-10)", value: "very_severe", severity: 9 },
    ],
  },
];

export default function EvaluationScreen({ onBack, onComplete }: EvaluationScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (severity: number) => {
    const newAnswers = [...answers, severity];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 150);
    } else {
      const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);
      setTimeout(() => {
        onComplete(totalScore);
      }, 150);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="h-full flex flex-col bg-white"
    >
      <div className="sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={onBack} className="p-2 -ml-2 active:opacity-60 transition-opacity">
            <ChevronLeft className="h-6 w-6 text-[#007AFF]" />
          </button>
          <div className="flex-1">
            <div className="h-1 bg-[#f5f5f7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#007AFF] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <span className="text-[15px] text-[#86868b]" style={{ fontWeight: 500 }}>
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>
      </div>

      <div className="flex-1 px-5 py-8 overflow-y-auto">
        <div className="mx-auto max-w-md space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <h2 className="text-[28px] tracking-tight" style={{ fontWeight: 600 }}>
                {questions[currentQuestion].question}
              </h2>
              <p className="text-[15px] text-[#86868b]">
                Selecciona la opción que mejor describa tu situación
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div className="space-y-3">
            <AnimatePresence mode="wait">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={`${currentQuestion}-${option.value}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => handleAnswer(option.severity || 0)}
                  className="w-full rounded-[16px] bg-[#f5f5f7] p-5 text-left transition-all hover:bg-[#e8e8ed] active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[17px]" style={{ fontWeight: 500 }}>
                      {option.label}
                    </span>
                    <svg className="h-5 w-5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
