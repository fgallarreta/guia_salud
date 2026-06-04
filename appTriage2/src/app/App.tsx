import { useState } from "react";
import { AnimatePresence } from "motion/react";
import StatusBar from "./components/StatusBar";
import HomeScreen from "./components/HomeScreen";
import EvaluationScreen from "./components/EvaluationScreen";
import ResultScreen from "./components/ResultScreen";
import MapScreen from "./components/MapScreen";

type Screen = "home" | "evaluation" | "result" | "map";
type MapFilter = "hospital" | "clinic" | "pharmacy" | "emergency" | undefined;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [evaluationScore, setEvaluationScore] = useState(0);
  const [mapFilter, setMapFilter] = useState<MapFilter>(undefined);

  const handleStartEvaluation = () => {
    setCurrentScreen("evaluation");
  };

  const handleCompleteEvaluation = (score: number) => {
    setEvaluationScore(score);
    setCurrentScreen("result");
  };

  const handleReset = () => {
    setCurrentScreen("home");
    setEvaluationScore(0);
    setMapFilter(undefined);
  };

  const handleOpenMap = (filter?: MapFilter) => {
    setMapFilter(filter);
    setCurrentScreen("map");
  };

  return (
    <div className="h-screen w-full max-w-[430px] mx-auto bg-white overflow-hidden shadow-2xl flex flex-col">
      <StatusBar />
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentScreen === "home" && (
            <HomeScreen
              key="home"
              onStartEvaluation={handleStartEvaluation}
              onOpenMap={handleOpenMap}
              userName="Ana"
            />
          )}

          {currentScreen === "evaluation" && (
            <EvaluationScreen
              key="evaluation"
              onBack={() => setCurrentScreen("home")}
              onComplete={handleCompleteEvaluation}
            />
          )}

          {currentScreen === "result" && (
            <ResultScreen
              key="result"
              score={evaluationScore}
              onReset={handleReset}
              onOpenMap={handleOpenMap}
            />
          )}

          {currentScreen === "map" && (
            <MapScreen
              key="map"
              onBack={() => setCurrentScreen(evaluationScore > 0 ? "result" : "home")}
              filterType={mapFilter}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}