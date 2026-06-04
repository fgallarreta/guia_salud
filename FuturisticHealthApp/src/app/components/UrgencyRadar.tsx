import { motion } from "motion/react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ArrowLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { GlassCard } from "./GlassCard";

interface UrgencyRadarProps {
  onBack: () => void;
  onViewResults: () => void;
}

const SCORE = 34;

const radarData = [
  { subject: "Cardiac", value: 24 },
  { subject: "Neuro", value: 38 },
  { subject: "Respiratory", value: 45 },
  { subject: "Digestive", value: 22 },
  { subject: "Immune", value: 30 },
  { subject: "Musculo", value: 15 },
];

const categories = [
  { label: "Respiratory", value: 45, color: "#ffb800" },
  { label: "Neurological", value: 38, color: "#1a6eff" },
  { label: "Immune Response", value: 30, color: "#00d4ff" },
  { label: "Cardiac", value: 24, color: "#00ff88" },
  { label: "Digestive", value: 22, color: "#00ff88" },
  { label: "Musculoskeletal", value: 15, color: "#00ff88" },
];

function ScoreGauge({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (score / 100) * circ;
  const color = score < 30 ? "#00ff88" : score < 50 ? "#ffb800" : score < 70 ? "#ff8800" : "#ff3355";
  const riskLabel =
    score < 30 ? "LOW RISK" : score < 50 ? "MODERATE RISK" : score < 70 ? "HIGH RISK" : "CRITICAL";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 160, height: 160 }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 120 120"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(26,110,255,0.1)" strokeWidth="7" />
          <motion.circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={circ}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "2.4rem",
              fontWeight: 700,
              color,
              lineHeight: 1,
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          >
            {score}
          </motion.p>
          <p style={{ color: "#6b9ac4", fontSize: "0.62rem", letterSpacing: "0.08em" }}>/ 100</p>
        </div>
      </div>
      <div
        className="mt-3 px-4 py-1.5 rounded-full"
        style={{
          background: `${color}18`,
          border: `1px solid ${color}50`,
          color,
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          boxShadow: `0 0 16px ${color}30`,
        }}
      >
        {riskLabel}
      </div>
    </div>
  );
}

export function UrgencyRadar({ onBack, onViewResults }: UrgencyRadarProps) {
  return (
    <div className="relative min-h-screen overflow-y-auto pb-28">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            top: "30%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(255,184,0,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center gap-3 relative z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(26,110,255,0.1)", border: "1px solid rgba(26,110,255,0.2)" }}
        >
          <ArrowLeft size={16} color="#6b9ac4" />
        </button>
        <div className="flex-1">
          <h2 style={{ color: "#e8f4ff", fontSize: "1rem", fontWeight: 600 }}>
            Urgency Assessment
          </h2>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              color: "#6b9ac4",
              letterSpacing: "0.1em",
            }}
          >
            AETHER AI · ANALYZED NOW
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          style={{ background: "rgba(255,184,0,0.12)", border: "1px solid rgba(255,184,0,0.25)" }}
        >
          <AlertTriangle size={12} color="#ffb800" />
          <span style={{ color: "#ffb800", fontSize: "0.62rem", fontWeight: 700 }}>MODERATE</span>
        </div>
      </div>

      {/* Score Gauge */}
      <div className="flex justify-center py-6 relative z-10">
        <ScoreGauge score={SCORE} />
      </div>

      {/* Radar Chart */}
      <div className="px-5 mb-5 relative z-10">
        <GlassCard>
          <div className="p-4">
            <p
              className="mb-4"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#6b9ac4",
                textTransform: "uppercase",
              }}
            >
              System Analysis Radar
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(26,110,255,0.15)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{
                    fill: "#6b9ac4",
                    fontSize: 10,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                />
                <PolarRadiusAxis domain={[0, 100]} hide />
                <Radar
                  dataKey="value"
                  stroke="#00d4ff"
                  fill="rgba(0,212,255,0.12)"
                  strokeWidth={2}
                  dot={{ fill: "#00d4ff", r: 3 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(6,18,50,0.95)",
                    border: "1px solid rgba(26,110,255,0.3)",
                    borderRadius: 8,
                    fontSize: "0.75rem",
                    color: "#e8f4ff",
                  }}
                  formatter={(val: number) => [`${val}%`, "Risk Level"]}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Category Breakdown */}
      <div className="px-5 mb-6 relative z-10">
        <GlassCard>
          <div className="p-4 space-y-4">
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: "#6b9ac4",
                textTransform: "uppercase",
              }}
            >
              Risk Breakdown
            </p>
            {categories.map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ color: "#a0c4e8", fontSize: "0.78rem" }}>{label}</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.72rem",
                      color,
                      fontWeight: 600,
                    }}
                  >
                    {value}%
                  </span>
                </div>
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 5, background: "rgba(26,110,255,0.08)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    style={{
                      background: color,
                      boxShadow: `0 0 8px ${color}80`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* CTA */}
      <div className="px-5 relative z-10">
        <button
          onClick={onViewResults}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #1a6eff, #00d4ff)",
            boxShadow: "0 0 30px rgba(26,110,255,0.4)",
            color: "#fff",
            fontSize: "0.95rem",
            fontWeight: 700,
          }}
        >
          View Full Report
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
