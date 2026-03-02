// Simulated engine sensor data for predictive maintenance
export interface SensorReading {
  cycle: number;
  sensor2: number;  // T2 - Total temp at fan inlet
  sensor3: number;  // T24 - Total temp at LPC outlet
  sensor4: number;  // T30 - Total temp at HPC outlet
  sensor7: number;  // T50 - Total temp at LPT outlet
  sensor11: number; // P30 - Total pressure at HPC outlet
  sensor12: number; // Nf - Physical fan speed
  sensor15: number; // Nc - Physical core speed
  sensor21: number; // BPR - Bypass ratio
}

export interface EngineData {
  engineId: string;
  totalCycles: number;
  currentCycle: number;
  rul: number;
  healthScore: number;
  status: "healthy" | "warning" | "critical";
  readings: SensorReading[];
}

function generateSensorData(totalCycles: number, degradationStart: number): SensorReading[] {
  const readings: SensorReading[] = [];
  for (let i = 1; i <= totalCycles; i++) {
    const degradation = i > degradationStart ? (i - degradationStart) / (totalCycles - degradationStart) : 0;
    const noise = () => (Math.random() - 0.5) * 2;
    readings.push({
      cycle: i,
      sensor2: 642.15 + degradation * 8 + noise(),
      sensor3: 1589.7 + degradation * 15 + noise() * 2,
      sensor4: 1400.6 - degradation * 20 + noise() * 3,
      sensor7: 554.36 + degradation * 12 + noise(),
      sensor11: 47.47 - degradation * 3 + noise() * 0.5,
      sensor12: 2388.0 - degradation * 25 + noise() * 5,
      sensor15: 8138.6 - degradation * 40 + noise() * 8,
      sensor21: 8.4195 - degradation * 0.5 + noise() * 0.02,
    });
  }
  return readings;
}

const engines: Record<string, EngineData> = {
  "EN-001": {
    engineId: "EN-001",
    totalCycles: 192,
    currentCycle: 192,
    rul: 45,
    healthScore: 82,
    status: "healthy",
    readings: generateSensorData(192, 140),
  },
  "EN-002": {
    engineId: "EN-002",
    totalCycles: 287,
    currentCycle: 287,
    rul: 18,
    healthScore: 54,
    status: "warning",
    readings: generateSensorData(287, 180),
  },
  "EN-003": {
    engineId: "EN-003",
    totalCycles: 340,
    currentCycle: 340,
    rul: 7,
    healthScore: 23,
    status: "critical",
    readings: generateSensorData(340, 200),
  },
  "EN-004": {
    engineId: "EN-004",
    totalCycles: 128,
    currentCycle: 128,
    rul: 112,
    healthScore: 95,
    status: "healthy",
    readings: generateSensorData(128, 100),
  },
  "EN-005": {
    engineId: "EN-005",
    totalCycles: 255,
    currentCycle: 255,
    rul: 30,
    healthScore: 65,
    status: "warning",
    readings: generateSensorData(255, 170),
  },
};

export function getEngineData(engineId: string): EngineData | null {
  return engines[engineId] || null;
}

export function getEngineIds(): string[] {
  return Object.keys(engines);
}

export function getDatasetEngines(dataset: string): string[] {
  if (dataset === "FD001") return ["EN-001", "EN-002", "EN-003"];
  if (dataset === "FD002") return ["EN-004", "EN-005"];
  if (dataset === "FD003") return Object.keys(engines);
  return [];
}

export function getAvailableDatasets(): string[] {
  return ["FD001", "FD002", "FD003"];
}

export function predictRUL(engineId: string, atCycle?: number): { rul: number; confidence: number } | null {
  const data = engines[engineId];
  if (!data) return null;
  const cycle = atCycle || data.currentCycle;
  const remaining = Math.max(0, data.rul - (cycle - data.currentCycle));
  const confidence = Math.max(60, 95 - (data.totalCycles - cycle) * 0.1);
  return { rul: Math.round(remaining), confidence: Math.round(confidence) };
}
