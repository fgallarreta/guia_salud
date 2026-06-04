import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Settings,
  Activity,
  Wind,
  Footprints,
  ChevronRight,
  Zap,
  Brain,
  TrendingUp,
} from "lucide-react";
import { GlassCard } from "./GlassCard";

interface HomeScreenProps {
  onStartAssessment: () => void;
}

export function HomeScreen({ onStartAssessment }: HomeScreenProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const vitals = [
    { icon: Activity, label: "Heart Rate", value: "72", unit: "BPM", color: "#ff3355" },
    { icon: Wind, label: "SpO₂", value: "98", unit: "%", color: "#00d4ff" },
    { icon: Footprints, label: "Steps", value: "6.2K", unit: "today", color: "#00ff88" },
  ];

  const tips = [
    { icon: Brain, text: "Hydration levels appear optimal based on your vitals." },
    { icon: TrendingUp, text: "Your health score improved 8% this week." },
  ];

  return (
    <div className="relative min-h-screen overflow-y-auto pb-28">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            top: "-80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(26,110,255,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "100px",
            right: "-60px",
            width: "280px",
            height: "280px",
            background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1a6eff, #00d4ff)" }}
          >
            <Zap size={14} color="#fff" />
          </div>
          <span
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              color: "#00d4ff",
            }}
          >
            AETHER HEALTH
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(26,110,255,0.1)", border: "1px solid rgba(26,110,255,0.2)" }}
          >
            <Bell size={14} color="#6b9ac4" />
          </button>
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(26,110,255,0.1)", border: "1px solid rgba(26,110,255,0.2)" }}
          >
            <Settings size={14} color="#6b9ac4" />
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-5 mb-5 relative z-10">
        <h1 style={{ color: "#e8f4ff", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.2 }}>
          Good morning, Alex
        </h1>
        <p
          className="mt-1"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            color: "#6b9ac4",
          }}
        >
          {formattedDate} · {formattedTime}
        </p>
      </div>

      {/* AI Assistant Card */}
      <div className="px-5 mb-5 relative z-10">
        <GlassCard glow="blue">
          <div className="p-5 relative overflow-hidden">
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(26,110,255,0.1) 0%, rgba(0,212,255,0.03) 100%)",
              }}
            />
            <div className="relative z-10">
              {/* Online badge */}
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88" }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    letterSpacing: "0.15em",
                    color: "#00ff88",
                  }}
                >
                  AI ASSISTANT ONLINE
                </span>
              </div>

              {/* AI Orb */}
              <div className="flex justify-center mb-5">
                <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        inset: `-${(i + 1) * 14}px`,
                        border: `1px solid rgba(26,110,255,${0.25 - i * 0.07})`,
                      }}
                      animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.15, 0.5] }}
                      transition={{ duration: 2.4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #1a6eff 0%, #00d4ff 100%)",
                      boxShadow: "0 0 30px rgba(26,110,255,0.5), 0 0 60px rgba(0,212,255,0.2)",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap size={28} color="#fff" />
                    </motion.div>
                  </div>
                </div>
              </div>

              <p
                className="text-center mb-1"
                style={{ color: "rgba(232,244,255,0.85)", fontSize: "0.95rem" }}
              >
                Hello Alex, I'm ready to help
              </p>
              <p
                className="text-center mb-5"
                style={{ color: "rgba(232,244,255,0.85)", fontSize: "0.95rem" }}
              >
                assess your health today.
              </p>

              <button
                onClick={onStartAssessment}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #1a6eff, #00d4ff)",
                  boxShadow: "0 0 20px rgba(26,110,255,0.5), 0 4px 20px rgba(0,0,0,0.3)",
                  color: "#fff",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Start Health Assessment
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Vitals */}
      <div className="px-5 mb-5 relative z-10">
        <p
          className="mb-3"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#6b9ac4",
            textTransform: "uppercase",
          }}
        >
          Vitals Today
        </p>
        <div className="grid grid-cols-3 gap-3">
          {vitals.map(({ icon: Icon, label, value, unit, color }) => (
            <GlassCard key={label}>
              <div className="p-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <p style={{ color: "#e8f4ff", fontSize: "1.2rem", fontWeight: 700, lineHeight: 1 }}>
                  {value}
                </p>
                <p style={{ color, fontSize: "0.65rem", fontWeight: 500, marginTop: 2 }}>{unit}</p>
                <p style={{ color: "#4a6a8a", fontSize: "0.6rem", marginTop: 4 }}>{label}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Last Assessment */}
      <div className="px-5 mb-5 relative z-10">
        <p
          className="mb-3"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#6b9ac4",
            textTransform: "uppercase",
          }}
        >
          Last Assessment
        </p>
        <GlassCard onClick={onStartAssessment}>
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ background: "#00ff88" }} />
                <span style={{ color: "#00ff88", fontSize: "0.85rem", fontWeight: 600 }}>
                  Low Risk
                </span>
              </div>
              <p style={{ color: "#6b9ac4", fontSize: "0.72rem" }}>
                2 days ago · 12% urgency score
              </p>
            </div>
            <ChevronRight size={16} color="#4a6a8a" />
          </div>
        </GlassCard>
      </div>

      {/* AI Health Tips */}
      <div className="px-5 relative z-10">
        <p
          className="mb-3"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.62rem",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#6b9ac4",
            textTransform: "uppercase",
          }}
        >
          AI Insights
        </p>
        <div className="space-y-3">
          {tips.map(({ icon: Icon, text }, i) => (
            <GlassCard key={i}>
              <div className="p-4 flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(26,110,255,0.15)" }}
                >
                  <Icon size={14} color="#1a6eff" />
                </div>
                <p style={{ color: "#a0c4e8", fontSize: "0.8rem", lineHeight: 1.5 }}>{text}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
