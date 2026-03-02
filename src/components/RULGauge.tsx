import { useMemo } from "react";

interface RULGaugeProps {
  rul: number;
  maxRul?: number;
  confidence?: number;
  status: "healthy" | "warning" | "critical";
}

const RULGauge = ({ rul, maxRul = 150, confidence = 90, status }: RULGaugeProps) => {
  const percentage = Math.min((rul / maxRul) * 100, 100);

  const statusConfig = useMemo(() => {
    switch (status) {
      case "healthy":
        return { label: "Healthy", ringClass: "text-success", glowClass: "glow-success", bgClass: "bg-success/10" };
      case "warning":
        return { label: "Warning", ringClass: "text-warning", glowClass: "glow-warning", bgClass: "bg-warning/10" };
      case "critical":
        return { label: "Critical", ringClass: "text-destructive", glowClass: "glow-destructive", bgClass: "bg-destructive/10" };
    }
  }, [status]);

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75; // 270 deg arc

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform rotate-[135deg]">
          {/* Background arc */}
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            strokeLinecap="round"
          />
          {/* Value arc */}
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="currentColor"
            className={`${statusConfig.ringClass} transition-all duration-1000 ease-out`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-bold text-foreground">{rul}</span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Cycles Left</span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${statusConfig.bgClass}`}>
        <div className={`h-2 w-2 rounded-full ${statusConfig.ringClass === "text-success" ? "bg-success" : statusConfig.ringClass === "text-warning" ? "bg-warning" : "bg-destructive"} animate-pulse-glow`} />
        <span className={`text-sm font-medium ${statusConfig.ringClass}`}>{statusConfig.label}</span>
      </div>

      <p className="font-mono text-xs text-muted-foreground">
        Confidence: {confidence}%
      </p>
    </div>
  );
};

export default RULGauge;
