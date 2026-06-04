import { Home, MessageSquare, BarChart2, MapPin } from "lucide-react";

type Screen = "home" | "symptoms" | "analysis" | "urgency" | "results" | "nearby";

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const navItems = [
  { id: "home" as Screen, icon: Home, label: "Home" },
  { id: "symptoms" as Screen, icon: MessageSquare, label: "Assess" },
  { id: "results" as Screen, icon: BarChart2, label: "Results" },
  { id: "nearby" as Screen, icon: MapPin, label: "Nearby" },
];

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const activeTab = ["analysis", "urgency"].includes(currentScreen)
    ? "symptoms"
    : currentScreen;

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-6 pt-2 z-40"
      style={{
        background: "rgba(2, 9, 21, 0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(26, 110, 255, 0.18)",
      }}
    >
      <div className="flex items-center justify-around">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all"
              style={{ minWidth: 60 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: isActive
                    ? "rgba(26, 110, 255, 0.18)"
                    : "transparent",
                  boxShadow: isActive
                    ? "0 0 16px rgba(0, 212, 255, 0.25)"
                    : "none",
                }}
              >
                <Icon
                  size={20}
                  style={{
                    color: isActive ? "#00d4ff" : "#4a6a8a",
                    filter: isActive
                      ? "drop-shadow(0 0 6px rgba(0,212,255,0.7))"
                      : "none",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#00d4ff" : "#4a6a8a",
                  letterSpacing: "0.05em",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
