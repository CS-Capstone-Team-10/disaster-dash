export type RangeKey = "day" | "week" | "month";

export type SeriesPoint = { t: string; v: number }; // ISO date + value

export type KpiData = {
  totalIncidents: {
    value: number;
    deltaPct: number;          // +/- change vs previous period
    series: SeriesPoint[];
  };
  mttr: {
    valueHours: number;
    segments: { label: "Optimal" | "Caution" | "Critical"; from: number; to: number }[];
    targetHours?: number;      // draw target tick on gauge
  };
  openIncidents: {
    open: number;
    resolved: number;
    series: SeriesPoint[];     // trend of opens over time
  };
};
