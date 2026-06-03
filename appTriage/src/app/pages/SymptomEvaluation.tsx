import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { triageQuestions } from '../data/questions';
import { calculateSeverity } from '../services/triageService';

export function SymptomEvaluation() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');

  const question = triageQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / triageQuestions.length) * 100;
  const isLastQuestion = currentQuestion === triageQuestions.length - 1;

  const handleNext = () => {
    if (!selectedOption) return;

    const selectedAnswer = question.options.find(opt => opt.id === selectedOption);
    if (!selectedAnswer) return;

    const newAnswers = { ...answers, [question.id]: selectedAnswer.points };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Calcular resultado
      const totalPoints = Object.values(newAnswers).reduce((sum, points) => sum + points, 0);
      const severity = calculateSeverity(totalPoints);
      navigate('/result', { state: { severity, totalPoints } });
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption('');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedOption('');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900">Evaluación de Síntomas</h1>
            <p className="text-sm text-gray-600">
              Pregunta {currentQuestion + 1} de {triageQuestions.length}
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Contenido */}
      <div className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {question.text}
              </h2>

              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Label
                        htmlFor={option.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedOption === option.id
                            ? 'border-[#1a3a5c] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <span className="flex-1 text-gray-900">{option.text}</span>
                        {selectedOption === option.id && (
                          <CheckCircle className="w-5 h-5 text-[#1a3a5c]" />
                        )}
                      </Label>
                    </motion.div>
                  ))}
                </div>
              </RadioGroup>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="flex-1"
              >
                {currentQuestion === 0 ? 'Cancelar' : 'Anterior'}
              </Button>
              <Button
                size="lg"
                onClick={handleNext}
                disabled={!selectedOption}
                className="flex-1 bg-[#1a3a5c] hover:bg-[#224e70]"
              >
                {isLastQuestion ? 'Ver Resultado' : 'Siguiente'}
                {!isLastQuestion && <ArrowRight className="w-5 h-5 ml-2" />}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
