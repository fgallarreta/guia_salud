import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle, Circle, Loader, Zap } from "lucide-react";

interface AnalysisScreenProps {
  onComplete: () => void;
}

const STEPS = [
  { label: "Parsing symptom data", detail: "NLP extraction complete" },
  { label: "Cross-referencing medical database", detail: "12,847 conditions scanned" },
  { label: "Running risk classification", detail: "Neural network inference" },
  { label: "Generating urgency score", detail: "Radar model calibration" },
  { label: "Compiling health report", detail: "AI report generation" },
];

export function AnalysisScreen({ onComplete }: AnalysisScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(step);
      setProgress(Math.round((step / STEPS.length) * 100));
      if (step >= STEPS.length) {
        clearInterval(interval);
        setTimeout(onComplete, 900);
      }
    }, 1100);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
      style={{ background: "#020915" }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(26,110,255,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Pulsing rings */}
      <div className="relative flex items-center justify-center mb-10" style={{ width: 160, height: 160 }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              inset: `-${i * 22}px`,
              border: `1px solid rgba(26,110,255,${0.35 - i * 0.07})`,
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2, delay: i * 0.35, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <motion.div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #1a6eff, #00d4ff)",
            boxShadow: "0 0 40px rgba(26,110,255,0.6), 0 0 80px rgba(0,212,255,0.2)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <Zap size={36} color="#fff" />
        </motion.div>
      </div>

      <p
        className="mb-2 text-center"
        style={{ color: "#e8f4ff", fontSize: "1.3rem", fontWeight: 700 }}
      >
        Analyzing Symptoms
      </p>
      <p
        className="mb-8 text-center"
        style={{ color: "#6b9ac4", fontSize: "0.82rem" }}
      >
        AETHER AI is processing your health data
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-2">
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 6, background: "rgba(26,110,255,0.1)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #1a6eff, #00d4ff)",
              boxShadow: "0 0 12px rgba(0,212,255,0.7)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      <p
        className="mb-10"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.72rem",
          color: "#00d4ff",
          letterSpacing: "0.05em",
        }}
      >
        {progress}% complete
      </p>

      {/* Step checklist */}
      <div className="w-full max-w-xs space-y-3">
        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              {done ? (
                <CheckCircle size={16} style={{ color: "#00ff88", flexShrink: 0 }} />
              ) : active ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader size={16} style={{ color: "#00d4ff", flexShrink: 0 }} />
                </motion.div>
              ) : (
                <Circle size={16} style={{ color: "#2a4a6a", flexShrink: 0 }} />
              )}
              <div className="flex-1">
                <p
                  style={{
                    color: done ? "#e8f4ff" : active ? "#00d4ff" : "#2a4a6a",
                    fontSize: "0.82rem",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {step.label}
                </p>
                {done && (
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.58rem",
                      color: "#00ff8888",
                      letterSpacing: "0.06em",
                    }}
                  >
                    ✓ {step.detail}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
