import type { ClassifiedTweet, MetricsSnapshot, Disaster } from "@/types/incidents";
import type { KpiData } from "@/types/kpi";

const users = ["@quakereport", "@stormwatch", "@wildfire_eye", "@floodalert", "@newswire"];
const cities = [
  { city: "Los Angeles, CA", stateId: "US-CA" },
  { city: "Miami, FL",        stateId: "US-FL" },
  { city: "Houston, TX",      stateId: "US-TX" },
  { city: "New York, NY",     stateId: "US-NY" },
  { city: "Seattle, WA",      stateId: "US-WA" },
];

const disasters: Disaster[] = ["earthquake", "wildfire", "flood", "hurricane", "other"];

export const initialMetrics: MetricsSnapshot = {
  windowLabel: "Last 24h",
  totalIncidents: 300,
  avgMTTRHours: 4.2,
  openIncidents: 45,
  resolvedPct: 0.85,
  trendTotals: [22,28,30,35,38,42,48,50,55,57,60,63],
  bySeverity: { critical: 15, high: 90, medium: 140, low: 55 },
  byDisaster: { earthquake: 38, wildfire: 82, flood: 66, hurricane: 45, other: 69 },
};

// Time series data for sparkline cards
export const incidentTimeSeries = [
  { date: "2025-10-01", value: 220 },
  { date: "2025-10-05", value: 235 },
  { date: "2025-10-10", value: 250 },
  { date: "2025-10-15", value: 265 },
  { date: "2025-10-20", value: 285 },
  { date: "2025-10-21", value: 300 },
];

// Resolution trend for open incidents card (% resolved over time)
export const resolutionTrend = [85, 86, 86, 87, 88, 89, 90];

// Disaster trend data for Recharts line chart
export const disasterTrendData = [
  { date: 'Jan', wildfires: 12, floods: 8, hurricanes: 3, earthquakes: 5 },
  { date: 'Feb', wildfires: 15, floods: 12, hurricanes: 2, earthquakes: 7 },
  { date: 'Mar', wildfires: 18, floods: 15, hurricanes: 4, earthquakes: 6 },
  { date: 'Apr', wildfires: 22, floods: 10, hurricanes: 5, earthquakes: 8 },
  { date: 'May', wildfires: 28, floods: 18, hurricanes: 7, earthquakes: 4 },
  { date: 'Jun', wildfires: 32, floods: 22, hurricanes: 9, earthquakes: 6 },
];

// Use static timestamps to avoid hydration errors
const staticTime = "2025-10-21T00:00:00.000Z";

export const initialTweets: ClassifiedTweet[] = [
  {
    id: "tweet-1",
    timestamp: staticTime,
    handle: "@quakereport",
    text: "Shaking felt in SF area, minor aftershocks reported.",
    disaster: "earthquake",
    stateId: "US-CA",
    city: "San Francisco, CA",
    confidence: 0.92,
  },
  {
    id: "tweet-2",
    timestamp: staticTime,
    handle: "@stormwatch",
    text: "Heavy rain causing flash flooding near Miami Beach.",
    disaster: "flood",
    stateId: "US-FL",
    city: "Miami, FL",
    confidence: 0.89,
  },
];

// KPI data for production dashboard
export const mockKpiData: KpiData = {
  totalIncidents: {
    value: 300,
    deltaPct: 12.5,
    series: [
      { t: "2025-10-15", v: 220 },
      { t: "2025-10-16", v: 235 },
      { t: "2025-10-17", v: 250 },
      { t: "2025-10-18", v: 265 },
      { t: "2025-10-19", v: 285 },
      { t: "2025-10-20", v: 295 },
      { t: "2025-10-21", v: 300 },
    ],
  },
  mttr: {
    valueHours: 4.2,
    segments: [
      { label: "Optimal", from: 0, to: 4 },
      { label: "Caution", from: 4, to: 8 },
      { label: "Critical", from: 8, to: 12 },
    ],
    targetHours: 3.5,
  },
  openIncidents: {
    open: 45,
    resolved: 255,
    series: [
      { t: "2025-10-15", v: 60 },
      { t: "2025-10-16", v: 58 },
      { t: "2025-10-17", v: 55 },
      { t: "2025-10-18", v: 52 },
      { t: "2025-10-19", v: 48 },
      { t: "2025-10-20", v: 46 },
      { t: "2025-10-21", v: 45 },
    ],
  },
};

// --- simple mock stream that everyone can subscribe to ---
type Listener = (tweet: ClassifiedTweet) => void;
const listeners = new Set<Listener>();

export function subscribeToTweetStream(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// Start a tiny in-memory generator (call once from a client component)
let ticking = false;
export function startMockTweetPump() {
  if (ticking) return;
  ticking = true;
  setInterval(() => {
    const d = disasters[Math.floor(Math.random() * disasters.length)];
    const place = cities[Math.floor(Math.random() * cities.length)];
    const tweet: ClassifiedTweet = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      handle: users[Math.floor(Math.random() * users.length)],
      text:
        d === "wildfire" ? "Smoke visible on ridge; crews en route." :
        d === "flood" ? "Roadway flooded; vehicles stranded." :
        d === "hurricane" ? "Wind gusts increasing along the coast." :
        d === "earthquake" ? "Short jolt reported; checking damage." :
        "Power outage reported across neighborhood.",
      disaster: d,
      stateId: place.stateId,
      city: place.city,
      confidence: 0.75 + Math.random() * 0.2,
    };
    // notify listeners
    listeners.forEach(fn => fn(tweet));
  }, 2000);
}
