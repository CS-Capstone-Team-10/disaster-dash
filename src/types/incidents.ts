export type Disaster = "earthquake" | "wildfire" | "flood" | "hurricane" | "other";

export type ClassifiedTweet = {
  id: string;
  timestamp: string;         // ISO
  handle: string;            // @user
  text: string;
  disaster: Disaster;
  stateId?: string;          // e.g., "US-CA"
  city?: string;
  confidence?: number;       // 0..1
};

export type MetricsSnapshot = {
  windowLabel: string;       // e.g., "Last 24h"
  totalIncidents: number;
  avgMTTRHours: number;
  openIncidents: number;
  resolvedPct: number;       // 0..1
  trendTotals: number[];     // 12 points (months) or 30 days
  bySeverity: { critical: number; high: number; medium: number; low: number };
  byDisaster: Record<Disaster, number>;
};
