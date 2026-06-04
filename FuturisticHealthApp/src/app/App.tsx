import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HomeScreen } from "./components/HomeScreen";
import { TriageAssessment } from "./components/TriageAssessment";
import { AnalysisScreen } from "./components/AnalysisScreen";
import { UrgencyRadar } from "./components/UrgencyRadar";
import { ResultsScreen } from "./components/ResultsScreen";
import { NearbyScreen } from "./components/NearbyScreen";
import { BottomNav } from "./components/BottomNav";

type Screen = "home" | "symptoms" | "analysis" | "urgency" | "results" | "nearby";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [nearbySpecialty, setNearbySpecialty] = useState<string | null>(null);

  const showNav = currentScreen !== "analysis";

  const handleNavigateNearby = (specialty: string) => {
    setNearbySpecialty(specialty);
    setCurrentScreen("nearby");
  };

  return (
    <div className="min-h-screen flex items-start justify-center" style={{ background: "#010710" }}>
      <div className="relative w-full max-w-[430px] min-h-screen overflow-hidden" style={{ background: "#020915" }}>
        {/* Scanline overlay */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(26,110,255,0.015) 2px, rgba(26,110,255,0.015) 4px)",
        }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            className="relative z-10"
            initial={{ opacity: 0, x: currentScreen === "home" ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {currentScreen === "home" && (
              <HomeScreen onStartAssessment={() => setCurrentScreen("symptoms")} />
            )}
            {currentScreen === "symptoms" && (
              <TriageAssessment
                onBack={() => setCurrentScreen("home")}
                onNavigateNearby={handleNavigateNearby}
              />
            )}
            {currentScreen === "analysis" && (
              <AnalysisScreen onComplete={() => setCurrentScreen("urgency")} />
            )}
            {currentScreen === "urgency" && (
              <UrgencyRadar
                onBack={() => setCurrentScreen("symptoms")}
                onViewResults={() => setCurrentScreen("results")}
              />
            )}
            {currentScreen === "results" && (
              <ResultsScreen
                onBack={() => setCurrentScreen("urgency")}
                onFindNearby={() => { setNearbySpecialty(null); setCurrentScreen("nearby"); }}
              />
            )}
            {currentScreen === "nearby" && (
              <NearbyScreen specialty={nearbySpecialty} />
            )}
          </motion.div>
        </AnimatePresence>

        {showNav && (
          <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </div>
    </div>
  );
}
