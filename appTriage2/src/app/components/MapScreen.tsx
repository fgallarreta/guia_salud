import { ChevronLeft, MapPin, Phone, Navigation, Clock } from "lucide-react";
import { motion } from "motion/react";

interface MapScreenProps {
  onBack: () => void;
  filterType?: "hospital" | "clinic" | "pharmacy" | "emergency";
}

interface MedicalFacility {
  id: number;
  name: string;
  type: "hospital" | "clinic" | "pharmacy" | "emergency";
  address: string;
  distance: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
}

const facilities: MedicalFacility[] = [
  {
    id: 1,
    name: "Hospital General",
    type: "hospital",
    address: "Av. Principal 123",
    distance: "0.8 km",
    phone: "+1 234 567 890",
    hours: "24 horas",
    lat: -34.603722,
    lng: -58.381592,
  },
  {
    id: 2,
    name: "Centro Médico Salud",
    type: "clinic",
    address: "Calle 5 #45-67",
    distance: "1.2 km",
    phone: "+1 234 567 891",
    hours: "8:00 - 20:00",
    lat: -34.604722,
    lng: -58.382592,
  },
  {
    id: 3,
    name: "Farmacia 24 Horas",
    type: "pharmacy",
    address: "Carrera 10 #23-45",
    distance: "0.5 km",
    phone: "+1 234 567 892",
    hours: "24 horas",
    lat: -34.602722,
    lng: -58.380592,
  },
  {
    id: 4,
    name: "Urgencias Médicas",
    type: "emergency",
    address: "Av. Libertador 789",
    distance: "2.1 km",
    phone: "911",
    hours: "24 horas",
    lat: -34.605722,
    lng: -58.383592,
  },
  {
    id: 5,
    name: "Clínica Dental Premium",
    type: "clinic",
    address: "Boulevard 456",
    distance: "1.5 km",
    phone: "+1 234 567 893",
    hours: "9:00 - 18:00",
    lat: -34.606722,
    lng: -58.379592,
  },
  {
    id: 6,
    name: "Farmacia Central",
    type: "pharmacy",
    address: "Plaza Mayor 12",
    distance: "0.9 km",
    phone: "+1 234 567 894",
    hours: "7:00 - 23:00",
    lat: -34.601722,
    lng: -58.381092,
  },
];

const typeColors = {
  hospital: { bg: "#E8F4FF", icon: "#007AFF", label: "Hospital" },
  clinic: { bg: "#E8F8EC", icon: "#34C759", label: "Clínica" },
  pharmacy: { bg: "#FFF4E6", icon: "#FF9500", label: "Farmacia" },
  emergency: { bg: "#FFE8E6", icon: "#FF3B30", label: "Emergencia" },
};

export default function MapScreen({ onBack, filterType }: MapScreenProps) {
  const filteredFacilities = filterType
    ? facilities.filter((f) => f.type === filterType)
    : facilities;

  const getScreenTitle = () => {
    if (!filterType) return "Mapa Sanitario";
    switch (filterType) {
      case "pharmacy":
        return "Farmacias Cercanas";
      case "emergency":
        return "Urgencias Cercanas";
      case "hospital":
        return "Hospitales Cercanos";
      case "clinic":
        return "Clínicas Cercanas";
      default:
        return "Mapa Sanitario";
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
      <div className="sticky top-0 bg-white z-10 border-b border-[#e5e5ea]">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={onBack} className="p-2 -ml-2 active:opacity-60 transition-opacity">
            <ChevronLeft className="h-6 w-6 text-[#007AFF]" />
          </button>
          <h2 className="text-[20px] tracking-tight" style={{ fontWeight: 600 }}>
            {getScreenTitle()}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Mapa simulado */}
        <div className="h-[280px] bg-gradient-to-br from-[#E8F4FF] to-[#D1E7FF] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-[#007AFF] mx-auto" />
              <p className="text-[15px] text-[#86868b]" style={{ fontWeight: 500 }}>
                Tu ubicación actual
              </p>
            </div>
          </div>

          {/* Puntos en el mapa simulado */}
          {filteredFacilities.slice(0, 4).map((facility, index) => (
            <div
              key={facility.id}
              className="absolute w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-pulse"
              style={{
                backgroundColor: typeColors[facility.type].icon,
                top: `${20 + index * 15}%`,
                left: `${30 + index * 12}%`,
                animationDelay: `${index * 200}ms`,
              }}
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Lista de prestaciones */}
        <div className="flex-1 overflow-y-auto bg-[#f5f5f7] px-5 py-4">
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] tracking-[-0.08px] text-[#86868b]" style={{ fontWeight: 400 }}>
                PRESTACIONES CERCANAS
              </p>
              <button className="flex items-center gap-1 text-[#007AFF] text-[13px]" style={{ fontWeight: 500 }}>
                <Navigation className="h-3.5 w-3.5" />
                Filtrar
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredFacilities.map((facility, index) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button className="w-full rounded-[16px] bg-white p-4 shadow-sm text-left transition-transform active:scale-[0.98]">
                  <div className="flex gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: typeColors[facility.type].bg }}
                    >
                      <MapPin
                        className="h-6 w-6"
                        style={{ color: typeColors[facility.type].icon }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-[17px] truncate" style={{ fontWeight: 600 }}>
                          {facility.name}
                        </h3>
                        <span className="text-[13px] text-[#86868b] whitespace-nowrap">
                          {facility.distance}
                        </span>
                      </div>

                      <p className="text-[15px] text-[#86868b] mb-2">{facility.address}</p>

                      <div className="flex items-center gap-4 text-[13px] text-[#86868b]">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{facility.hours}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          <span>{facility.phone}</span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <span
                          className="inline-block text-[11px] px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: typeColors[facility.type].bg,
                            color: typeColors[facility.type].icon,
                            fontWeight: 600,
                          }}
                        >
                          {typeColors[facility.type].label}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
