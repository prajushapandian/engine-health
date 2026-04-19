import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { SensorReading } from "@/lib/engineData";

interface DegradationChartProps {
  readings: SensorReading[];
  rul: number;
}

const DegradationChart = ({ readings, rul }: DegradationChartProps) => {
  // Compute a degradation index per cycle from normalized sensor drift
  const baseline = readings.slice(0, Math.max(5, Math.floor(readings.length * 0.1)));
  const baseT30 = baseline.reduce((a, r) => a + r.sensor4, 0) / baseline.length;
  const baseP30 = baseline.reduce((a, r) => a + r.sensor11, 0) / baseline.length;
  const baseNc = baseline.reduce((a, r) => a + r.sensor15, 0) / baseline.length;

  const data = readings.map((r) => {
    const dT = (baseT30 - r.sensor4) / baseT30;
    const dP = (baseP30 - r.sensor11) / baseP30;
    const dN = (baseNc - r.sensor15) / baseNc;
    const idx = Math.max(0, Math.min(100, ((dT + dP + dN) / 3) * 100 * 4));
    return { cycle: r.cycle, degradation: Number(idx.toFixed(2)) };
  });

  const failureCycle = readings[readings.length - 1].cycle + rul;

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <defs>
            <linearGradient id="degGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.7} />
              <stop offset="60%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(185, 72%, 48%)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
          <XAxis
            dataKey="cycle"
            stroke="hsl(215, 15%, 50%)"
            tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
          />
          <YAxis
            stroke="hsl(215, 15%, 50%)"
            tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
            domain={[0, 100]}
            label={{ value: "Deg. Index", angle: -90, position: "insideLeft", fill: "hsl(215, 15%, 50%)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(220, 22%, 10%)",
              border: "1px solid hsl(220, 18%, 18%)",
              borderRadius: "8px",
              fontFamily: "JetBrains Mono",
              fontSize: "12px",
              color: "hsl(210, 20%, 90%)",
            }}
          />
          <ReferenceLine
            y={75}
            stroke="hsl(0, 72%, 55%)"
            strokeDasharray="4 4"
            label={{ value: "Critical", fill: "hsl(0, 72%, 55%)", fontSize: 10, position: "right" }}
          />
          <ReferenceLine
            y={50}
            stroke="hsl(38, 92%, 50%)"
            strokeDasharray="4 4"
            label={{ value: "Warning", fill: "hsl(38, 92%, 50%)", fontSize: 10, position: "right" }}
          />
          <Area
            type="monotone"
            dataKey="degradation"
            stroke="hsl(0, 72%, 55%)"
            strokeWidth={2}
            fill="url(#degGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
        Projected failure ~ cycle {failureCycle}
      </p>
    </div>
  );
};

export default DegradationChart;
