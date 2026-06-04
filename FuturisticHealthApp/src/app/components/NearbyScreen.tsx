import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Clock, Star, Navigation, Building2, ExternalLink } from "lucide-react";
import { GlassCard } from "./GlassCard";

type Filter = "all" | "pharmacy" | "hospital" | "gastroenterology";

interface NearbyScreenProps {
  specialty?: string | null;
}

const ALL_FACILITIES = [
  { id: 1, name: "Hospital General — Urgencias", type: "hospital" as const, specialty: null, dist: "0.8 km", addr: "245 Medical Center Dr", status: "Abierto 24h", rating: 4.8, emergency: true, phone: "+1 (555) 234-5678", mapX: 68, mapY: 38 },
  { id: 2, name: "MedPlus Farmacia", type: "pharmacy" as const, specialty: null, dist: "0.3 km", addr: "102 Health Blvd", status: "Hasta las 22:00", rating: 4.6, emergency: false, phone: "+1 (555) 345-6789", mapX: 38, mapY: 52 },
  { id: 3, name: "LifeCare Centro Médico", type: "hospital" as const, specialty: null, dist: "1.4 km", addr: "88 Clinical Avenue", status: "Abierto 24h", rating: 4.5, emergency: true, phone: "+1 (555) 456-7890", mapX: 72, mapY: 68 },
  { id: 4, name: "QuickMeds Express", type: "pharmacy" as const, specialty: null, dist: "0.7 km", addr: "316 Wellness Street", status: "Hasta las 23:00", rating: 4.3, emergency: false, phone: "+1 (555) 567-8901", mapX: 25, mapY: 30 },
  { id: 5, name: "Hospital Regional — Servicio de Gastroenterología", type: "hospital" as const, specialty: "gastroenterology", dist: "0.9 km", addr: "245 Medical Center Dr, Piso 3", status: "Abierto 24h — Guardia GI", rating: 4.9, emergency: true, phone: "+1 (555) 234-5678", mapX: 67, mapY: 36 },
  { id: 6, name: "Centro Digestivo Avanzado", type: "hospital" as const, specialty: "gastroenterology", dist: "1.1 km", addr: "Calle Clínica 88", status: "Lun–Vie 08:00–20:00", rating: 4.7, emergency: false, phone: "+1 (555) 345-6789", mapX: 30, mapY: 42 },
  { id: 7, name: "Clínica Gastroenterológica Dr. Medina", type: "hospital" as const, specialty: "gastroenterology", dist: "1.8 km", addr: "Blvd. Salud 316, Local 4", status: "Lun–Sáb 07:00–22:00", rating: 4.6, emergency: false, phone: "+1 (555) 456-7890", mapX: 78, mapY: 60 },
  { id: 8, name: "Instituto de Enfermedades Digestivas", type: "hospital" as const, specialty: "gastroenterology", dist: "2.4 km", addr: "Av. Universidad 501", status: "Abierto 24h — UCI Digestiva", rating: 4.8, emergency: true, phone: "+1 (555) 567-8901", mapX: 22, mapY: 68 },
];

const SPECIALTY_META: Record<string, { label: string; color: string; icon: string }> = {
  gastroenterology: { label: "Gastroenterología", color: "#ff8c42", icon: "🫃" },
  cardiology: { label: "Cardiología", color: "#ff3355", icon: "❤️" },
  neurology: { label: "Neurología", color: "#a855f7", icon: "🧠" },
  pulmonology: { label: "Neumología", color: "#00d4ff", icon: "🫁" },
  orthopedics: { label: "Traumatología", color: "#f59e0b", icon: "🦴" },
};

export function NearbyScreen({ specialty = null }: NearbyScreenProps) {
  const isGISpecialty = specialty === "gastroenterology";
  const defaultFilter: Filter = isGISpecialty ? "gastroenterology" : "all";
  const [filter, setFilter] = useState<Filter>(defaultFilter);
  const [selected, setSelected] = useState<number | null>(null);

  const specMeta = specialty ? SPECIALTY_META[specialty] : null;

  const visible = ALL_FACILITIES.filter((f) => {
    if (filter === "gastroenterology") return f.specialty === "gastroenterology";
    if (filter === "all") return true;
    if (filter === "hospital") return f.type === "hospital" && !f.specialty;
    if (filter === "pharmacy") return f.type === "pharmacy";
    return true;
  }).sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist));

  const filters: { id: Filter; label: string }[] = [
    ...(specialty === "gastroenterology" ? [{ id: "gastroenterology" as Filter, label: "🫃 Gastro" }] : []),
    { id: "all", label: "Todos" },
    { id: "hospital", label: "Hospitales" },
    { id: "pharmacy", label: "Farmacias" },
  ];

  return (
    <div className="relative min-h-screen overflow-y-auto pb-28">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute rounded-full" style={{ bottom: "120px", left: "-60px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
      </div>

      {/* Header */}
      <div className="px-5 pt-14 pb-4 relative z-10">
        <div className="flex items-center justify-between mb-1">
          <div>
            {specMeta && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{specMeta.icon}</span>
                <span className="px-2 py-0.5 rounded-lg" style={{ background: `${specMeta.color}18`, border: `1px solid ${specMeta.color}40`, color: specMeta.color, fontSize: "0.62rem", fontWeight: 700 }}>
                  {specMeta.label}
                </span>
              </div>
            )}
            <h2 style={{ color: "#e8f4ff", fontSize: "1.1rem", fontWeight: 700 }}>
              {specMeta ? `Centros de ${specMeta.label}` : "Centros de Salud Cercanos"}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <Navigation size={12} color="#00d4ff" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#00d4ff" }}>GPS ACTIVO</span>
          </div>
        </div>
        <p style={{ color: "#6b9ac4", fontSize: "0.75rem" }}>Basado en tu ubicación actual · San Francisco, CA</p>
      </div>

      {/* Google Maps CTA for specialty */}
      {specMeta && (
        <div className="px-5 mb-4 relative z-10">
          <a
            href={`https://www.google.com/maps/search/${encodeURIComponent(specMeta.label + " cerca de mi")}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: `${specMeta.color}18`, border: `1px solid ${specMeta.color}35`, color: specMeta.color, fontSize: "0.82rem", fontWeight: 700, display: "flex" }}
          >
            <ExternalLink size={14} />
            Buscar {specMeta.label} en Google Maps
          </a>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="px-5 mb-4 relative z-10">
        <div className="flex gap-2 flex-wrap">
          {filters.map(({ id, label }) => (
            <button key={id} onClick={() => setFilter(id)} className="px-3 py-2 rounded-xl transition-all"
              style={{
                background: filter === id ? "rgba(26,110,255,0.2)" : "rgba(6,18,50,0.65)",
                border: `1px solid ${filter === id ? "rgba(26,110,255,0.5)" : "rgba(26,110,255,0.15)"}`,
                color: filter === id ? "#00d4ff" : "#6b9ac4",
                fontSize: "0.78rem", fontWeight: filter === id ? 600 : 400,
                boxShadow: filter === id ? "0 0 12px rgba(0,212,255,0.2)" : "none",
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="px-5 mb-5 relative z-10">
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 200, background: "#04102A", border: "1px solid rgba(26,110,255,0.2)" }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {[15, 30, 45, 60, 75, 90].map(y => <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="rgba(26,110,255,0.07)" strokeWidth="0.5" />)}
            {[10, 25, 40, 55, 70, 85].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="rgba(26,110,255,0.07)" strokeWidth="0.5" />)}
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(26,110,255,0.18)" strokeWidth="1" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(26,110,255,0.18)" strokeWidth="1" />
            {[[12,17,11,10],[28,7,13,8],[43,17,10,11],[12,55,14,12],[28,52,11,13],[62,17,10,10],[62,55,12,11],[78,32,10,10]].map(([x,y,w,h],i) => (
              <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(10,25,60,0.6)" stroke="rgba(26,110,255,0.06)" strokeWidth="0.3" rx="0.5" />
            ))}
            {visible.map((f) => {
              const color = f.specialty === "gastroenterology" ? "#ff8c42" : f.type === "hospital" ? "#ff3355" : "#00d4ff";
              return (
                <g key={f.id}>
                  <circle cx={f.mapX} cy={f.mapY} r="3" fill={`${color}25`} />
                  <circle cx={f.mapX} cy={f.mapY} r="1.8" fill={color} />
                </g>
              );
            })}
            {/* User */}
            <circle cx="50" cy="50" r="5" fill="rgba(26,110,255,0.2)" />
            <circle cx="50" cy="50" r="3" fill="#1a6eff" />
            <circle cx="50" cy="50" r="1.2" fill="#fff" />
          </svg>
          <motion.div className="absolute left-0 right-0 pointer-events-none"
            style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)" }}
            animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
          <div className="absolute bottom-2 right-2 flex gap-2 flex-wrap">
            {filter !== "pharmacy" && filter !== "gastroenterology" && <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#ff3355" }} /><span style={{ color: "#ff3355", fontSize: "0.5rem", fontWeight: 600 }}>Hospital</span></div>}
            {(filter === "gastroenterology" || filter === "all") && <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#ff8c42" }} /><span style={{ color: "#ff8c42", fontSize: "0.5rem", fontWeight: 600 }}>Gastro</span></div>}
            {filter !== "hospital" && filter !== "gastroenterology" && <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#00d4ff" }} /><span style={{ color: "#00d4ff", fontSize: "0.5rem", fontWeight: 600 }}>Farmacia</span></div>}
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: "#1a6eff" }} /><span style={{ color: "#6b9ac4", fontSize: "0.5rem", fontWeight: 600 }}>Tú</span></div>
          </div>
          <div className="absolute top-2 left-2"><p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.45rem", color: "#1a6eff88" }}>37.7749° N · 122.4194° W</p></div>
        </div>
      </div>

      {/* Count */}
      <div className="px-5 mb-3 relative z-10">
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.12em", color: "#6b9ac4", textTransform: "uppercase" }}>
          {visible.length} centros encontrados
        </p>
      </div>

      {/* Facility List */}
      <div className="px-5 space-y-3 relative z-10">
        {visible.map((f, i) => {
          const isGI = f.specialty === "gastroenterology";
          const typeColor = isGI ? "#ff8c42" : f.type === "hospital" ? "#ff3355" : "#00d4ff";
          const isSelected = selected === f.id;
          return (
            <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <GlassCard onClick={() => setSelected(isSelected ? null : f.id)} glow={isSelected ? "cyan" : "none"}>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${typeColor}15` }}>
                      {isGI ? <span style={{ fontSize: "1.1rem" }}>🫃</span> : f.type === "hospital" ? <Building2 size={18} style={{ color: typeColor }} /> : <span style={{ fontSize: "1.1rem" }}>💊</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <p className="truncate" style={{ color: "#e8f4ff", fontSize: "0.85rem", fontWeight: 600 }}>{f.name}</p>
                        {f.emergency && <span className="shrink-0 px-1.5 py-0.5 rounded" style={{ background: "rgba(255,51,85,0.15)", border: "1px solid rgba(255,51,85,0.3)", color: "#ff3355", fontSize: "0.5rem", fontWeight: 700 }}>24H</span>}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1"><MapPin size={10} color="#6b9ac4" /><span style={{ color: "#6b9ac4", fontSize: "0.7rem" }}>{f.dist}</span></div>
                        <div className="flex items-center gap-1"><Clock size={10} color="#6b9ac4" /><span style={{ color: "#6b9ac4", fontSize: "0.7rem" }}>{f.status}</span></div>
                        <div className="flex items-center gap-1"><Star size={10} color="#ffb800" fill="#ffb800" /><span style={{ color: "#ffb800", fontSize: "0.7rem" }}>{f.rating}</span></div>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(26,110,255,0.15)" }}>
                      <p style={{ color: "#6b9ac4", fontSize: "0.73rem", marginBottom: 8 }}>📍 {f.addr}</p>
                      <div className="flex gap-2">
                        <a href={`tel:${f.phone}`} className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2"
                          style={{ background: "rgba(26,110,255,0.15)", border: "1px solid rgba(26,110,255,0.3)", color: "#1a6eff", fontSize: "0.78rem", fontWeight: 600 }}>
                          <Phone size={12} />Llamar
                        </a>
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(f.name)}/`} target="_blank" rel="noopener noreferrer"
                          className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2"
                          style={{ background: "linear-gradient(135deg, #1a6eff, #00d4ff)", color: "#fff", fontSize: "0.78rem", fontWeight: 600 }}>
                          <Navigation size={12} />Navegar
                        </a>
                      </div>
                    </motion.div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
