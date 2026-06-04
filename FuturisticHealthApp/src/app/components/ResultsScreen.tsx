import { motion } from "motion/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
  AlertTriangle,
  Shield,
  Droplets,
  Moon,
  Activity,
  Pill,
} from "lucide-react";
import { GlassCard } from "./GlassCard";

interface ResultsScreenProps {
  onBack: () => void;
  onFindNearby: () => void;
}

const riskTrend = [
  { day: "Mon", risk: 12 },
  { day: "Tue", risk: 19 },
  { day: "Wed", risk: 15 },
  { day: "Thu", risk: 28 },
  { day: "Fri", risk: 24 },
  { day: "Sat", risk: 38 },
  { day: "Sun", risk: 34 },
];

const conditions = [
  { name: "Tension Headache", prob: 87, color: "#ffb800" },
  { name: "Dehydration", prob: 73, color: "#1a6eff" },
  { name: "Migraine (early stage)", prob: 45, color: "#ff8800" },
  { name: "Sinusitis", prob: 31, color: "#00d4ff" },
  { name: "Viral infection", prob: 18, color: "#6b9ac4" },
];

const recommendations = [
  { icon: Droplets, text: "Increase water intake to 2.5L today", priority: "high" },
  { icon: Moon, text: "Rest in a quiet, darkened room", priority: "high" },
  { icon: Pill, text: "OTC analgesics (ibuprofen/acetaminophen) if needed", priority: "medium" },
  { icon: Activity, text: "Monitor symptoms every 4 hours", priority: "medium" },
  { icon: Shield, text: "Seek emergency care if pain escalates above 8/10", priority: "urgent" },
];

const priorityColors: Record<string, string> = {
  high: "#00d4ff",
  medium: "#ffb800",
  urgent: "#ff3355",
};

export function ResultsScreen({ onBack, onFindNearby }: ResultsScreenProps) {
  return (
    <div className="relative min-h-screen overflow-y-auto pb-28">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            top: "20%",
            right: "-100px",
            width: "350px",
            height: "350px",
            background: "radial-gradient(circle, rgba(26,110,255,0.06) 0%, transparent 70%)",
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
            Analysis Report
          </h2>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              color: "#6b9ac4",
              letterSpacing: "0.1em",
            }}
          >
            AETHER AI · JUN 3, 2026 · 09:52 AM
          </p>
        </div>
      </div>

      {/* Risk Hero Card */}
      <div className="px-5 mb-5 relative z-10">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255,184,0,0.15), rgba(255,136,0,0.08))",
            border: "1px solid rgba(255,184,0,0.3)",
            boxShadow: "0 0 30px rgba(255,184,0,0.1)",
          }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #ffb800 0%, transparent 70%)", transform: "translate(40%, -40%)" }} />
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,184,0,0.2)" }}
            >
              <AlertTriangle size={18} color="#ffb800" />
            </div>
            <div>
              <p style={{ color: "#ffb800", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em" }}>
                RISK ASSESSMENT
              </p>
              <p style={{ color: "#e8f4ff", fontSize: "1.1rem", fontWeight: 700 }}>
                Moderate Risk
              </p>
            </div>
            <div className="ml-auto text-right">
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2rem", fontWeight: 700, color: "#ffb800", lineHeight: 1 }}>
                34
              </p>
              <p style={{ color: "#6b9ac4", fontSize: "0.65rem" }}>/ 100</p>
            </div>
          </div>
          <p style={{ color: "#a0c4e8", fontSize: "0.78rem", lineHeight: 1.5 }}>
            Symptoms suggest a non-emergency condition. Self-care measures recommended with monitoring.
          </p>
        </div>
      </div>

      {/* Risk Trend Chart */}
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
              Risk Trend — Last 7 Days
            </p>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={riskTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a6eff" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#1a6eff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fill: "#4a6a8a", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis domain={[0, 60]} hide />
                <Tooltip
                  contentStyle={{
                    background: "rgba(6,18,50,0.95)",
                    border: "1px solid rgba(26,110,255,0.3)",
                    borderRadius: 8,
                    fontSize: "0.72rem",
                    color: "#e8f4ff",
                  }}
                  formatter={(val: number) => [`${val}%`, "Risk"]}
                />
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="#1a6eff"
                  fill="url(#riskGrad)"
                  strokeWidth={2}
                  dot={{ fill: "#1a6eff", r: 3, strokeWidth: 0 }}
                  activeDot={{ fill: "#00d4ff", r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Possible Conditions */}
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
              Possible Conditions
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={conditions}
                layout="vertical"
                margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fill: "#a0c4e8", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(6,18,50,0.95)",
                    border: "1px solid rgba(26,110,255,0.3)",
                    borderRadius: 8,
                    fontSize: "0.72rem",
                    color: "#e8f4ff",
                  }}
                  formatter={(val: number) => [`${val}%`, "Probability"]}
                />
                <Bar dataKey="prob" radius={[0, 4, 4, 0]}>
                  {conditions.map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Recommendations */}
      <div className="px-5 mb-6 relative z-10">
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
              AI Recommendations
            </p>
            <div className="space-y-3">
              {recommendations.map(({ icon: Icon, text, priority }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${priorityColors[priority]}15` }}
                  >
                    <Icon size={14} style={{ color: priorityColors[priority] }} />
                  </div>
                  <p style={{ color: "#a0c4e8", fontSize: "0.8rem", lineHeight: 1.5 }}>{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* CTA */}
      <div className="px-5 relative z-10">
        <button
          onClick={onFindNearby}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #1a6eff, #00d4ff)",
            boxShadow: "0 0 30px rgba(26,110,255,0.4)",
            color: "#fff",
            fontSize: "0.95rem",
            fontWeight: 700,
          }}
        >
          <MapPin size={18} />
          Find Nearby Healthcare
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
