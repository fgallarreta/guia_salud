import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, Mic, Zap, ChevronRight } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface SymptomChatProps {
  onBack: () => void;
  onAnalyze: () => void;
}

type Stage = "initial" | "severity" | "duration" | "additional" | "ready";

interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
}

const AI_RESPONSES: Record<Stage, string> = {
  initial: "",
  severity:
    "I understand. On a scale of 1–10, how severe would you rate the pain or discomfort?",
  duration:
    "Got it. How long have you been experiencing these symptoms?",
  additional:
    "Any accompanying symptoms? Select all that apply, or type additional details.",
  ready:
    "Thank you, Alex. I have enough information to run a comprehensive analysis. Ready when you are.",
};

const DURATIONS = ["< 1 hour", "1–6 hours", "6–24 hours", "1–3 days", "3+ days"];
const EXTRA_SYMPTOMS = ["Nausea", "Dizziness", "Fatigue", "Fever", "Chills", "No others"];

export function SymptomChat({ onBack, onAnalyze }: SymptomChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "ai-0",
      role: "ai",
      content:
        "Hello! I'm AETHER, your AI health assistant. Please describe your symptoms and I'll help assess your condition. What are you experiencing today?",
    },
  ]);
  const [stage, setStage] = useState<Stage>("initial");
  const [input, setInput] = useState("");
  const [severity, setSeverity] = useState<number | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (role: "ai" | "user", content: string) => {
    const id = `${role}-${Date.now()}`;
    setMessages((prev) => [...prev, { id, role, content }]);
  };

  const advanceStage = (userContent: string, nextStage: Stage) => {
    addMessage("user", userContent);
    setTimeout(() => {
      addMessage("ai", AI_RESPONSES[nextStage]);
      setStage(nextStage);
    }, 700);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    if (stage === "initial") {
      advanceStage(text, "severity");
    } else if (stage === "additional") {
      addMessage("user", text);
      setTimeout(() => {
        addMessage("ai", AI_RESPONSES["ready"]);
        setStage("ready");
      }, 700);
    }
  };

  const handleSeverity = (val: number) => {
    setSeverity(val);
    const label =
      val <= 3 ? "mild" : val <= 6 ? "moderate" : val <= 8 ? "severe" : "very severe";
    advanceStage(`I'd rate it a ${val}/10 — ${label}.`, "duration");
  };

  const handleDuration = (val: string) => {
    advanceStage(val, "additional");
  };

  const toggleExtra = (sym: string) => {
    setSelectedExtras((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleExtrasConfirm = () => {
    const text =
      selectedExtras.length === 0 || selectedExtras.includes("No others")
        ? "No additional symptoms."
        : `Also experiencing: ${selectedExtras.filter((s) => s !== "No others").join(", ")}.`;
    advanceStage(text, "ready");
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            top: "-60px",
            right: "-80px",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <div
        className="px-5 pt-14 pb-4 flex items-center gap-3 relative z-10"
        style={{ borderBottom: "1px solid rgba(26,110,255,0.12)" }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(26,110,255,0.1)", border: "1px solid rgba(26,110,255,0.2)" }}
        >
          <ArrowLeft size={16} color="#6b9ac4" />
        </button>
        <div className="flex-1">
          <h2 style={{ color: "#e8f4ff", fontSize: "1rem", fontWeight: 600 }}>
            Symptom Assessment
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00ff88" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                color: "#00ff88",
                letterSpacing: "0.1em",
              }}
            >
              AETHER ACTIVE
            </span>
          </div>
        </div>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #1a6eff22, #00d4ff22)", border: "1px solid rgba(0,212,255,0.2)" }}
        >
          <Zap size={16} color="#00d4ff" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 relative z-10 pb-60">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "ai" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center mr-2 shrink-0 mt-1"
                  style={{ background: "linear-gradient(135deg, #1a6eff, #00d4ff)" }}
                >
                  <Zap size={12} color="#fff" />
                </div>
              )}
              <div
                className="max-w-[75%] px-4 py-3 rounded-2xl"
                style={
                  msg.role === "ai"
                    ? {
                        background: "rgba(6,18,50,0.8)",
                        border: "1px solid rgba(26,110,255,0.2)",
                        color: "#e8f4ff",
                        fontSize: "0.88rem",
                        lineHeight: 1.5,
                      }
                    : {
                        background: "linear-gradient(135deg, #1a6eff, #0050cc)",
                        color: "#fff",
                        fontSize: "0.88rem",
                        lineHeight: 1.5,
                        boxShadow: "0 4px 20px rgba(26,110,255,0.3)",
                      }
                }
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Interactive: Severity Scale */}
        {stage === "severity" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="w-full ml-9">
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                  const color =
                    n <= 3 ? "#00ff88" : n <= 6 ? "#ffb800" : n <= 8 ? "#ff8800" : "#ff3355";
                  return (
                    <button
                      key={n}
                      onClick={() => handleSeverity(n)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90"
                      style={{
                        background:
                          severity === n ? `${color}30` : "rgba(6,18,50,0.8)",
                        border: `1px solid ${severity === n ? color : "rgba(26,110,255,0.2)"}`,
                        color: severity === n ? color : "#6b9ac4",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Interactive: Duration */}
        {stage === "duration" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="ml-9 flex flex-wrap gap-2"
          >
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => handleDuration(d)}
                className="px-4 py-2 rounded-xl transition-all active:scale-95"
                style={{
                  background: "rgba(6,18,50,0.8)",
                  border: "1px solid rgba(26,110,255,0.25)",
                  color: "#a0c4e8",
                  fontSize: "0.82rem",
                }}
              >
                {d}
              </button>
            ))}
          </motion.div>
        )}

        {/* Interactive: Additional Symptoms */}
        {stage === "additional" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="ml-9"
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {EXTRA_SYMPTOMS.map((sym) => {
                const sel = selectedExtras.includes(sym);
                return (
                  <button
                    key={sym}
                    onClick={() => toggleExtra(sym)}
                    className="px-3 py-2 rounded-xl transition-all active:scale-95"
                    style={{
                      background: sel ? "rgba(26,110,255,0.2)" : "rgba(6,18,50,0.8)",
                      border: `1px solid ${sel ? "#1a6eff" : "rgba(26,110,255,0.2)"}`,
                      color: sel ? "#00d4ff" : "#a0c4e8",
                      fontSize: "0.8rem",
                    }}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleExtrasConfirm}
              className="px-4 py-2 rounded-xl flex items-center gap-2"
              style={{
                background: "rgba(26,110,255,0.15)",
                border: "1px solid rgba(26,110,255,0.3)",
                color: "#1a6eff",
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              Confirm <ChevronRight size={14} />
            </button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom: Input or Analyze */}
      <div className="fixed left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-4 pt-3 z-50"
        style={{ bottom: 88, background: "rgba(2,9,21,0.95)", backdropFilter: "blur(20px)" }}>
        {stage === "ready" ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onAnalyze}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg, #1a6eff, #00d4ff)",
              boxShadow: "0 0 30px rgba(26,110,255,0.5)",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            <Zap size={18} />
            Analyze My Symptoms
            <ChevronRight size={18} />
          </motion.button>
        ) : (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-2xl"
            style={{
              background: "rgba(6,18,50,0.85)",
              border: "1px solid rgba(26,110,255,0.25)",
            }}
          >
            <button className="text-[#4a6a8a] flex-shrink-0">
              <Mic size={18} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                stage === "initial"
                  ? "Describe your symptoms..."
                  : "Add more details..."
              }
              className="flex-1 bg-transparent outline-none"
              style={{ color: "#e8f4ff", fontSize: "0.88rem" }}
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: input.trim()
                  ? "linear-gradient(135deg, #1a6eff, #00d4ff)"
                  : "rgba(26,110,255,0.1)",
              }}
            >
              <Send size={14} color={input.trim() ? "#fff" : "#4a6a8a"} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
