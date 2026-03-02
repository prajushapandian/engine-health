import { sensorConfig } from "./SensorChart";

interface SensorSelectorProps {
  selected: string[];
  onChange: (sensors: string[]) => void;
}

const SensorSelector = ({ selected, onChange }: SensorSelectorProps) => {
  const toggle = (sensor: string) => {
    if (selected.includes(sensor)) {
      if (selected.length > 1) onChange(selected.filter((s) => s !== sensor));
    } else {
      onChange([...selected, sensor]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(sensorConfig).map(([key, config]) => (
        <button
          key={key}
          onClick={() => toggle(key)}
          className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-all ${
            selected.includes(key)
              ? "border border-primary/50 bg-primary/10 text-primary"
              : "border border-border bg-muted text-muted-foreground hover:border-primary/30"
          }`}
        >
          {config.label}
        </button>
      ))}
    </div>
  );
};

export default SensorSelector;
