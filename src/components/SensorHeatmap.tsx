import { useMemo } from "react";
import type { SensorReading } from "@/lib/engineData";
import { sensorConfig } from "./SensorChart";

interface SensorHeatmapProps {
  data: SensorReading[];
}

const SENSOR_KEYS = ["sensor2", "sensor3", "sensor4", "sensor7", "sensor11", "sensor12", "sensor15", "sensor21"] as const;

function pearson(x: number[], y: number[]): number {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = x[i] - mx;
    const b = y[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const denom = Math.sqrt(dx * dy);
  return denom === 0 ? 0 : num / denom;
}

function corrColor(v: number): string {
  // v in [-1, 1] -> hsl: red (negative) to cyan (positive)
  const intensity = Math.abs(v);
  const hue = v >= 0 ? 185 : 0;
  const sat = 60 + intensity * 30;
  const light = 50 - intensity * 25;
  return `hsl(${hue}, ${sat}%, ${light}%)`;
}

const SensorHeatmap = ({ data }: SensorHeatmapProps) => {
  const matrix = useMemo(() => {
    const series = SENSOR_KEYS.map((k) => data.map((r) => r[k] as number));
    return SENSOR_KEYS.map((_, i) =>
      SENSOR_KEYS.map((_, j) => pearson(series[i], series[j]))
    );
  }, [data]);

  const labels = SENSOR_KEYS.map((k) => sensorConfig[k]?.label.split(" ")[0] || k);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `80px repeat(${SENSOR_KEYS.length}, minmax(48px, 1fr))` }}
        >
          <div />
          {labels.map((l) => (
            <div
              key={`col-${l}`}
              className="font-mono text-[10px] text-muted-foreground text-center pb-1"
            >
              {l}
            </div>
          ))}
          {matrix.map((row, i) => (
            <>
              <div
                key={`row-${labels[i]}`}
                className="font-mono text-[10px] text-muted-foreground flex items-center justify-end pr-2"
              >
                {labels[i]}
              </div>
              {row.map((v, j) => (
                <div
                  key={`cell-${i}-${j}`}
                  className="aspect-square rounded flex items-center justify-center font-mono text-[10px] font-medium text-foreground transition-transform hover:scale-110 hover:z-10 cursor-default"
                  style={{ backgroundColor: corrColor(v) }}
                  title={`${labels[i]} × ${labels[j]}: ${v.toFixed(2)}`}
                >
                  {v.toFixed(1)}
                </div>
              ))}
            </>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3 justify-center">
          <span className="font-mono text-[10px] text-muted-foreground">-1.0</span>
          <div
            className="h-2 w-48 rounded"
            style={{
              background:
                "linear-gradient(to right, hsl(0,90%,25%), hsl(0,60%,50%), hsl(220,10%,30%), hsl(185,60%,50%), hsl(185,90%,25%))",
            }}
          />
          <span className="font-mono text-[10px] text-muted-foreground">+1.0</span>
        </div>
      </div>
    </div>
  );
};

export default SensorHeatmap;
