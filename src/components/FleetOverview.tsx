import { getEngineData, type EngineData } from "@/lib/engineData";
import { Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface FleetOverviewProps {
  engineIds: string[];
  selectedEngine?: string;
  onSelectEngine: (id: string) => void;
}

const statusIcon = {
  healthy: <CheckCircle className="h-4 w-4 text-success" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
  critical: <XCircle className="h-4 w-4 text-destructive" />,
};

const FleetOverview = ({ engineIds, selectedEngine, onSelectEngine }: FleetOverviewProps) => {
  const engines = engineIds.map((id) => getEngineData(id)).filter(Boolean) as EngineData[];

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Fleet Status
        </h2>
      </div>

      <div className="space-y-2">
        {engines.map((engine) => (
          <button
            key={engine.engineId}
            onClick={() => onSelectEngine(engine.engineId)}
            className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors ${
              selectedEngine === engine.engineId
                ? "border-glow border bg-muted"
                : "hover:bg-muted/50"
            }`}
          >
            <div className="flex items-center gap-3">
              {statusIcon[engine.status]}
              <span className="font-mono text-sm font-medium text-foreground">{engine.engineId}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">
                RUL: {engine.rul}
              </span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    engine.status === "healthy"
                      ? "bg-success"
                      : engine.status === "warning"
                      ? "bg-warning"
                      : "bg-destructive"
                  }`}
                  style={{ width: `${engine.healthScore}%` }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FleetOverview;
