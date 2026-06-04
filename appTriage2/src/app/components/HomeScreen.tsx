import { MapPin, Clock, HelpCircle, Map } from "lucide-react";
import { motion } from "motion/react";
import logoImg from "../../imports/1000163791.jpg";

interface HomeScreenProps {
  onStartEvaluation: () => void;
  onOpenMap: () => void;
  userName?: string;
}

export default function HomeScreen({ onStartEvaluation, onOpenMap, userName = "Usuario" }: HomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="h-full overflow-y-auto bg-[#f5f5f7] px-5 py-8"
    >
      <div className="mx-auto max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <img
            src={logoImg}
            alt="Guía Salud"
            className="w-32 h-32 object-contain"
          />
          <div className="text-center space-y-2">
            <h1 className="text-[34px] tracking-tight" style={{ fontWeight: 600 }}>
              Hola, {userName}
            </h1>
            <p className="text-[17px] text-[#86868b]">
              ¿Cómo te sientes hoy?
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onStartEvaluation}
            className="w-full rounded-[14px] bg-[#007AFF] py-4 text-[17px] text-white transition-transform active:scale-[0.98]"
            style={{ fontWeight: 600 }}
          >
            Iniciar evaluación
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-[13px] tracking-[-0.08px] text-[#86868b]" style={{ fontWeight: 400 }}>
            ACCESOS RÁPIDOS
          </p>

          <div className="grid grid-cols-2 gap-3">
            <QuickAccessCard
              icon={<Map className="h-6 w-6 text-[#007AFF]" />}
              title="Mapa Sanitario"
              subtitle="Cercanas"
              onClick={onOpenMap}
            />
            <QuickAccessCard
              icon={<Clock className="h-6 w-6 text-[#007AFF]" />}
              title="Historial"
              subtitle="Ver más"
            />
          </div>

          <button className="w-full rounded-[14px] bg-white p-4 shadow-sm flex items-center justify-between transition-transform active:scale-[0.98]">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-6 w-6 text-[#007AFF]" />
              <span className="text-[17px]" style={{ fontWeight: 500 }}>Ayuda</span>
            </div>
            <svg className="h-5 w-5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function QuickAccessCard({ icon, title, subtitle, onClick }: { icon: React.ReactNode; title: string; subtitle: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="rounded-[14px] bg-white p-4 shadow-sm text-left transition-transform active:scale-[0.98]">
      <div className="mb-2">{icon}</div>
      <p className="text-[17px]" style={{ fontWeight: 500 }}>{title}</p>
      <p className="text-[13px] text-[#86868b]">{subtitle}</p>
    </button>
  );
}
