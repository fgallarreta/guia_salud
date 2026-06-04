import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: "blue" | "cyan" | "none";
  onClick?: () => void;
}

export function GlassCard({ children, className = "", glow = "none", onClick }: GlassCardProps) {
  const glowShadow =
    glow === "blue"
      ? "0 0 40px rgba(26,110,255,0.25), 0 8px 32px rgba(0,0,0,0.4)"
      : glow === "cyan"
      ? "0 0 40px rgba(0,212,255,0.25), 0 8px 32px rgba(0,0,0,0.4)"
      : "0 8px 32px rgba(0,0,0,0.3)";

  return (
    <div
      className={`rounded-2xl ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      style={{
        background: "rgba(6, 18, 50, 0.65)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(26, 110, 255, 0.18)",
        boxShadow: glowShadow,
      }}
    >
      {children}
    </div>
  );
}
