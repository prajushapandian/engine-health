import { type ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "stable";
}

const MetricCard = ({ label, value, unit, icon }: MetricCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 animate-slide-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div className="rounded-md bg-muted p-2 text-primary">{icon}</div>
      </div>
    </div>
  );
};

export default MetricCard;
