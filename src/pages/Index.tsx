import { useState, useCallback } from "react";
import InputPanel from "@/components/InputPanel";
import RULGauge from "@/components/RULGauge";
import SensorChart from "@/components/SensorChart";
import SensorHeatmap from "@/components/SensorHeatmap";
import DegradationChart from "@/components/DegradationChart";
import SensorSelector from "@/components/SensorSelector";
import FleetOverview from "@/components/FleetOverview";
import MetricCard from "@/components/MetricCard";
import { getEngineData, getDatasetEngines, predictRUL, type EngineData } from "@/lib/engineData";
import { Gauge, Clock, Thermometer, Zap } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [engine, setEngine] = useState<EngineData | null>(null);
  const [fleetIds, setFleetIds] = useState<string[]>([]);
  const [selectedSensors, setSelectedSensors] = useState(["sensor2", "sensor4", "sensor11"]);
  const [prediction, setPrediction] = useState<{ rul: number; confidence: number } | null>(null);

  const handleEngineSubmit = useCallback((engineId: string, cycle?: number) => {
    const data = getEngineData(engineId);
    if (!data) {
      toast.error("Engine not found");
      return;
    }
    setEngine(data);
    const pred = predictRUL(engineId, cycle);
    setPrediction(pred);
    if (!fleetIds.includes(engineId)) {
      setFleetIds((prev) => [...prev, engineId]);
    }
    toast.success(`Loaded ${engineId} — RUL: ${pred?.rul ?? "N/A"} cycles`);
  }, [fleetIds]);

  const handleDatasetSubmit = useCallback((dataset: string) => {
    const ids = getDatasetEngines(dataset);
    setFleetIds(ids);
    if (ids.length > 0) {
      const first = getEngineData(ids[0]);
      setEngine(first);
      setPrediction(predictRUL(ids[0]));
    }
    toast.success(`Dataset ${dataset} loaded — ${ids.length} engines`);
  }, []);

  const handleSelectEngine = useCallback((id: string) => {
    const data = getEngineData(id);
    setEngine(data);
    setPrediction(predictRUL(id));
  }, []);

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 glow-primary">
              <Gauge className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">SPAE</h1>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Engine Health Monitoring</p>
            </div>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container py-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <InputPanel onSubmitEngine={handleEngineSubmit} onSubmitDataset={handleDatasetSubmit} />
            {fleetIds.length > 0 && (
              <FleetOverview
                engineIds={fleetIds}
                selectedEngine={engine?.engineId}
                onSelectEngine={handleSelectEngine}
              />
            )}
          </aside>

          {/* Content */}
          <div className="space-y-6">
            {!engine ? (
              <div className="flex min-h-[500px] items-center justify-center rounded-lg border border-dashed border-border">
                <div className="text-center">
                  <Gauge className="mx-auto mb-3 h-12 w-12 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    Select an engine or load a dataset to begin analysis
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Metrics row */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    label="Engine ID"
                    value={engine.engineId}
                    icon={<Zap className="h-4 w-4" />}
                  />
                  <MetricCard
                    label="Total Cycles"
                    value={engine.totalCycles}
                    unit="cycles"
                    icon={<Clock className="h-4 w-4" />}
                  />
                  <MetricCard
                    label="Health Score"
                    value={engine.healthScore}
                    unit="%"
                    icon={<Gauge className="h-4 w-4" />}
                  />
                  <MetricCard
                    label="Avg Temp"
                    value={Math.round(engine.readings[engine.readings.length - 1]?.sensor2 || 0)}
                    unit="°R"
                    icon={<Thermometer className="h-4 w-4" />}
                  />
                </div>

                {/* RUL + Chart */}
                <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Remaining Useful Life
                    </h3>
                    {prediction && (
                      <RULGauge
                        rul={prediction.rul}
                        confidence={prediction.confidence}
                        status={engine.status}
                      />
                    )}
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Sensor Trends
                      </h3>
                    </div>
                    <SensorSelector selected={selectedSensors} onChange={setSelectedSensors} />
                    <div className="mt-4">
                      <SensorChart data={engine.readings} selectedSensors={selectedSensors} />
                    </div>
                  </div>
                </div>

                {/* Degradation + Heatmap */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Degradation Trajectory
                    </h3>
                    {prediction && (
                      <DegradationChart readings={engine.readings} rul={prediction.rul} />
                    )}
                  </div>

                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Sensor Correlation Heatmap
                    </h3>
                    <SensorHeatmap data={engine.readings} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
