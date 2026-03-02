import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { SensorReading } from "@/lib/engineData";

interface SensorChartProps {
  data: SensorReading[];
  selectedSensors?: string[];
}

const sensorConfig: Record<string, { label: string; color: string }> = {
  sensor2: { label: "T2 (Fan Inlet)", color: "hsl(185, 72%, 48%)" },
  sensor3: { label: "T24 (LPC Outlet)", color: "hsl(152, 60%, 45%)" },
  sensor4: { label: "T30 (HPC Outlet)", color: "hsl(38, 92%, 50%)" },
  sensor7: { label: "T50 (LPT Outlet)", color: "hsl(280, 60%, 55%)" },
  sensor11: { label: "P30 (HPC Pressure)", color: "hsl(0, 72%, 55%)" },
  sensor12: { label: "Nf (Fan Speed)", color: "hsl(200, 80%, 60%)" },
  sensor15: { label: "Nc (Core Speed)", color: "hsl(60, 70%, 50%)" },
  sensor21: { label: "BPR (Bypass Ratio)", color: "hsl(320, 60%, 55%)" },
};

const SensorChart = ({ data, selectedSensors = ["sensor2", "sensor4", "sensor11"] }: SensorChartProps) => {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
          <XAxis
            dataKey="cycle"
            stroke="hsl(215, 15%, 50%)"
            tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
            label={{ value: "Cycle", position: "insideBottomRight", offset: -5, fill: "hsl(215, 15%, 50%)" }}
          />
          <YAxis
            stroke="hsl(215, 15%, 50%)"
            tick={{ fill: "hsl(215, 15%, 50%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
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
          <Legend
            wrapperStyle={{ fontFamily: "Inter", fontSize: "12px", color: "hsl(215, 15%, 50%)" }}
          />
          {selectedSensors.map((sensor) => (
            <Line
              key={sensor}
              type="monotone"
              dataKey={sensor}
              name={sensorConfig[sensor]?.label || sensor}
              stroke={sensorConfig[sensor]?.color || "#888"}
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export { sensorConfig };
export default SensorChart;
