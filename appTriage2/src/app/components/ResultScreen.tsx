import { MapPin, Phone, Home } from "lucide-react";
import { motion } from "motion/react";

interface ResultScreenProps {
  score: number;
  onReset: () => void;
  onOpenMap: (filter?: "hospital" | "clinic" | "pharmacy" | "emergency") => void;
}

interface UrgencyLevel {
  level: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  title: string;
  recommendation: string;
  icon: string;
}

function getUrgencyLevel(score: number): UrgencyLevel {
  if (score <= 5) {
    return {
      level: "Baja",
      color: "#34C759",
      bgColor: "#E8F8EC",
      borderColor: "#34C759",
      textColor: "#1F7A3A",
      title: "Urgencia Baja",
      recommendation: "Tus síntomas no parecen requerir atención inmediata. Puedes tratarlos en casa con medicamentos de venta libre.",
      icon: "✓",
    };
  } else if (score <= 10) {
    return {
      level: "Moderada",
      color: "#FFCC00",
      bgColor: "#FFF9E6",
      borderColor: "#FFCC00",
      textColor: "#996F00",
      title: "Urgencia Moderada",
      recommendation: "Te recomendamos consultar con tu médico de cabecera en las próximas 24-48 horas.",
      icon: "!",
    };
  } else if (score <= 15) {
    return {
      level: "Alta",
      color: "#FF9500",
      bgColor: "#FFF4E6",
      borderColor: "#FF9500",
      textColor: "#CC6F00",
      title: "Urgencia Alta",
      recommendation: "Debes buscar atención médica lo antes posible. Considera visitar una clínica de urgencias hoy.",
      icon: "!!",
    };
  } else {
    return {
      level: "Emergencia",
      color: "#FF3B30",
      bgColor: "#FFE8E6",
      borderColor: "#FF3B30",
      textColor: "#CC1F17",
      title: "Emergencia Médica",
      recommendation: "Tus síntomas requieren atención médica inmediata. Dirígete a urgencias o llama al número de emergencias.",
      icon: "⚠",
    };
  }
}

const pharmacies = [
  { name: "Farmacia Salud", address: "Av. Principal 123", distance: "0.5 km" },
  { name: "Farmacia Central", address: "Calle 5 #45-67", distance: "1.2 km" },
  { name: "Farmacia 24 Horas", address: "Carrera 10 #23-45", distance: "2.1 km" },
];

export default function ResultScreen({ score, onReset, onOpenMap }: ResultScreenProps) {
  const urgency = getUrgencyLevel(score);

  const getMapFilterType = (score: number): "pharmacy" | "clinic" | "emergency" => {
    if (score <= 5) return "pharmacy";
    if (score <= 10) return "clinic";
    return "emergency";
  };

  const handleOpenMap = () => {
    onOpenMap(getMapFilterType(score));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="h-full overflow-y-auto bg-[#f5f5f7]"
    >
      <div className="mx-auto max-w-md">
        <div className="bg-white px-5 pt-12 pb-8">
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
              className="flex justify-center"
            >
              <div
                className="relative h-32 w-32 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: urgency.bgColor,
                  border: `3px solid ${urgency.borderColor}`,
                }}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                    className="text-[48px]"
                    style={{ fontWeight: 700, color: urgency.color }}
                  >
                    {score}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <div className="text-center space-y-2">
              <h2 className="text-[28px] tracking-tight" style={{ fontWeight: 600 }}>
                {urgency.title}
              </h2>
              <div
                className="inline-block rounded-full px-4 py-1.5 text-[13px]"
                style={{
                  backgroundColor: urgency.bgColor,
                  color: urgency.textColor,
                  fontWeight: 600,
                }}
              >
                Nivel: {urgency.level.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-6 space-y-4">
          <div className="rounded-[16px] bg-white p-5 shadow-sm">
            <h3 className="mb-2 text-[13px] tracking-[-0.08px] text-[#86868b]" style={{ fontWeight: 400 }}>
              RECOMENDACIÓN
            </h3>
            <p className="text-[17px] leading-relaxed" style={{ fontWeight: 400 }}>
              {urgency.recommendation}
            </p>
          </div>

          {score > 10 && (
            <button
              className="w-full rounded-[14px] py-4 text-[17px] text-white transition-transform active:scale-[0.98]"
              style={{
                backgroundColor: urgency.color,
                fontWeight: 600,
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-5 w-5" />
                {score > 15 ? "Llamar a emergencias" : "Agendar cita"}
              </div>
            </button>
          )}

          <button
            onClick={handleOpenMap}
            className="w-full rounded-[14px] bg-[#007AFF] py-4 text-[17px] text-white transition-transform active:scale-[0.98]"
            style={{ fontWeight: 600 }}
          >
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" />
              {score <= 5
                ? "Ver farmacias cercanas"
                : score <= 10
                ? "Ver clínicas cercanas"
                : "Ver urgencias cercanas"}
            </div>
          </button>

          <button
            onClick={onReset}
            className="w-full rounded-[14px] bg-white py-4 text-[17px] text-[#007AFF] shadow-sm transition-transform active:scale-[0.98]"
            style={{ fontWeight: 600 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Home className="h-5 w-5" />
              Volver al inicio
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
