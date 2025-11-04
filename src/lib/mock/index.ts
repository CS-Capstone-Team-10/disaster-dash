import type { StateDisasterDatum } from "@/types/disaster";
import type { ClassifiedTweet, MetricsSnapshot, Disaster } from "@/types/incidents";
import type { KpiData } from "@/types/kpi";

// ============================================================================
// CENTRALIZED MOCK DATA FOR ALL PAGES
// ============================================================================

// State-level disaster aggregation data for choropleth map
export const MOCK_STATE_DATA: StateDisasterDatum[] = [
  { id: "US-CA", byType: { wildfire: 72, earthquake: 44, flood: 6 }, total: 122 },
  { id: "US-TX", byType: { flood: 48, hurricane: 22, other: 15 }, total: 85 },
  { id: "US-FL", byType: { hurricane: 41, flood: 18, other: 7 }, total: 66 },
  { id: "US-NY", byType: { other: 42, flood: 12 }, total: 54 },
  { id: "US-WA", byType: { wildfire: 12, flood: 13 }, total: 25 },
  { id: "US-OK", byType: { other: 28, flood: 8 }, total: 36 },
  { id: "US-OR", byType: { wildfire: 18, earthquake: 6 }, total: 24 },
  { id: "US-AZ", byType: { wildfire: 22, other: 10 }, total: 32 },
  { id: "US-NV", byType: { earthquake: 14, other: 8 }, total: 22 },
  { id: "US-CO", byType: { wildfire: 16, flood: 5 }, total: 21 },
];

// Tweet/incident data structure for alerts and live feed
export type MockTweet = {
  id: string;
  createdAt: string; // ISO timestamp
  state: string; // US state code like "CA", "TX"
  city?: string;
  type: "earthquake" | "wildfire" | "flood" | "hurricane" | "other";
  text: string;
  confidence: number; // 0-1
  source: "bluesky" | "twitter";
  status: "new" | "triaged" | "dismissed";
  handle?: string;
};

// Sample tweets for all pages
export const MOCK_TWEETS: MockTweet[] = [
  {
    id: "tweet-1",
    createdAt: "2025-10-27T14:30:00.000Z",
    state: "CA",
    city: "San Francisco",
    type: "earthquake",
    text: "Shaking felt in SF area, minor aftershocks reported.",
    confidence: 0.92,
    source: "twitter",
    status: "new",
    handle: "@quakereport",
  },
  {
    id: "tweet-2",
    createdAt: "2025-10-27T14:25:00.000Z",
    state: "FL",
    city: "Miami Beach",
    type: "flood",
    text: "Heavy rain causing flash flooding near Miami Beach.",
    confidence: 0.89,
    source: "twitter",
    status: "new",
    handle: "@stormwatch",
  },
  {
    id: "tweet-3",
    createdAt: "2025-10-27T14:20:00.000Z",
    state: "TX",
    city: "Houston",
    type: "hurricane",
    text: "Hurricane winds picking up along the coast. Residents taking shelter.",
    confidence: 0.95,
    source: "bluesky",
    status: "triaged",
    handle: "@weathertrack",
  },
  {
    id: "tweet-4",
    createdAt: "2025-10-27T14:15:00.000Z",
    state: "CA",
    city: "Los Angeles",
    type: "wildfire",
    text: "Smoke visible on ridge near Malibu; crews en route.",
    confidence: 0.87,
    source: "twitter",
    status: "new",
    handle: "@wildfire_eye",
  },
  {
    id: "tweet-5",
    createdAt: "2025-10-27T14:10:00.000Z",
    state: "NY",
    city: "New York",
    type: "other",
    text: "Power outage reported across multiple neighborhoods.",
    confidence: 0.78,
    source: "twitter",
    status: "dismissed",
    handle: "@newswire",
  },
  {
    id: "tweet-6",
    createdAt: "2025-10-27T14:05:00.000Z",
    state: "WA",
    city: "Seattle",
    type: "flood",
    text: "Roadway flooded near downtown; vehicles stranded.",
    confidence: 0.91,
    source: "bluesky",
    status: "new",
    handle: "@floodalert",
  },
  {
    id: "tweet-7",
    createdAt: "2025-10-27T14:00:00.000Z",
    state: "TX",
    city: "Austin",
    type: "flood",
    text: "Creek overflowing, emergency services on scene.",
    confidence: 0.85,
    source: "twitter",
    status: "triaged",
    handle: "@stormwatch",
  },
  {
    id: "tweet-8",
    createdAt: "2025-10-27T13:55:00.000Z",
    state: "CA",
    city: "San Diego",
    type: "earthquake",
    text: "Short jolt reported; checking for damage.",
    confidence: 0.88,
    source: "twitter",
    status: "new",
    handle: "@quakereport",
  },
  {
    id: "tweet-9",
    createdAt: "2025-10-27T13:50:00.000Z",
    state: "FL",
    city: "Tampa",
    type: "hurricane",
    text: "Storm surge warnings issued for coastal areas.",
    confidence: 0.93,
    source: "bluesky",
    status: "new",
    handle: "@weathertrack",
  },
  {
    id: "tweet-10",
    createdAt: "2025-10-27T13:45:00.000Z",
    state: "OR",
    city: "Portland",
    type: "wildfire",
    text: "Wildfire spreading near forest boundary, evacuations underway.",
    confidence: 0.96,
    source: "twitter",
    status: "triaged",
    handle: "@wildfire_eye",
  },
  {
    id: "tweet-11",
    createdAt: "2025-10-27T13:40:00.000Z",
    state: "AZ",
    city: "Phoenix",
    type: "wildfire",
    text: "Smoke plume visible from I-10, fire crews responding.",
    confidence: 0.84,
    source: "twitter",
    status: "new",
    handle: "@wildfire_eye",
  },
  {
    id: "tweet-12",
    createdAt: "2025-10-27T13:35:00.000Z",
    state: "CO",
    city: "Denver",
    type: "flood",
    text: "Flash flood warning issued for metro area.",
    confidence: 0.90,
    source: "bluesky",
    status: "new",
    handle: "@floodalert",
  },
  {
    id: "tweet-13",
    createdAt: "2025-10-27T13:30:00.000Z",
    state: "NV",
    city: "Las Vegas",
    type: "earthquake",
    text: "Minor tremor felt across the valley.",
    confidence: 0.82,
    source: "twitter",
    status: "dismissed",
    handle: "@quakereport",
  },
  {
    id: "tweet-14",
    createdAt: "2025-10-27T13:25:00.000Z",
    state: "WA",
    city: "Spokane",
    type: "wildfire",
    text: "Wildfire contained at 40%, weather conditions favorable.",
    confidence: 0.86,
    source: "twitter",
    status: "triaged",
    handle: "@wildfire_eye",
  },
  {
    id: "tweet-15",
    createdAt: "2025-10-27T13:20:00.000Z",
    state: "TX",
    city: "Dallas",
    type: "other",
    text: "Severe thunderstorm warning, large hail reported.",
    confidence: 0.79,
    source: "bluesky",
    status: "new",
    handle: "@weathertrack",
  },
];

// KPI aggregate data
export const MOCK_KPIS = {
  totalIncidents: 300,
  totalIncidentsDelta: 12.5, // percentage change
  mttrHours: 4.2,
  mttrDelta: -8.3, // negative = improvement
  openIncidents: 45,
  openDelta: -6.2, // negative = fewer open
};

// Time series data for sparklines and trend charts
export const MOCK_TRENDS = {
  totalIncidents: [
    { date: "2025-10-15", value: 220 },
    { date: "2025-10-16", value: 235 },
    { date: "2025-10-17", value: 250 },
    { date: "2025-10-18", value: 265 },
    { date: "2025-10-19", value: 285 },
    { date: "2025-10-20", value: 295 },
    { date: "2025-10-21", value: 300 },
  ],
  openIncidents: [
    { date: "2025-10-15", value: 60 },
    { date: "2025-10-16", value: 58 },
    { date: "2025-10-17", value: 55 },
    { date: "2025-10-18", value: 52 },
    { date: "2025-10-19", value: 48 },
    { date: "2025-10-20", value: 46 },
    { date: "2025-10-21", value: 45 },
  ],
};

// Disaster trend data for multi-line charts
export const MOCK_DISASTER_TRENDS = [
  { date: "Jan", wildfires: 12, floods: 8, hurricanes: 3, earthquakes: 5 },
  { date: "Feb", wildfires: 15, floods: 12, hurricanes: 2, earthquakes: 7 },
  { date: "Mar", wildfires: 18, floods: 15, hurricanes: 4, earthquakes: 6 },
  { date: "Apr", wildfires: 22, floods: 10, hurricanes: 5, earthquakes: 8 },
  { date: "May", wildfires: 28, floods: 18, hurricanes: 7, earthquakes: 4 },
  { date: "Jun", wildfires: 32, floods: 22, hurricanes: 9, earthquakes: 6 },
];

// KPI data structure (existing format for compatibility)
export const MOCK_KPI_DATA: KpiData = {
  totalIncidents: {
    value: MOCK_KPIS.totalIncidents,
    deltaPct: MOCK_KPIS.totalIncidentsDelta,
    series: MOCK_TRENDS.totalIncidents.map(d => ({ t: d.date, v: d.value })),
  },
  mttr: {
    valueHours: MOCK_KPIS.mttrHours,
    segments: [
      { label: "Optimal", from: 0, to: 4 },
      { label: "Caution", from: 4, to: 8 },
      { label: "Critical", from: 8, to: 12 },
    ],
    targetHours: 3.5,
  },
  openIncidents: {
    open: MOCK_KPIS.openIncidents,
    resolved: MOCK_KPIS.totalIncidents - MOCK_KPIS.openIncidents,
    series: MOCK_TRENDS.openIncidents.map(d => ({ t: d.date, v: d.value })),
  },
};

// Metrics snapshot (legacy format for compatibility)
export const MOCK_METRICS: MetricsSnapshot = {
  windowLabel: "Last 24h",
  totalIncidents: MOCK_KPIS.totalIncidents,
  avgMTTRHours: MOCK_KPIS.mttrHours,
  openIncidents: MOCK_KPIS.openIncidents,
  resolvedPct: 0.85,
  trendTotals: [22, 28, 30, 35, 38, 42, 48, 50, 55, 57, 60, 63],
  bySeverity: { critical: 15, high: 90, medium: 140, low: 55 },
  byDisaster: { earthquake: 38, wildfire: 82, flood: 66, hurricane: 45, other: 69 },
};

// Convert MockTweet to ClassifiedTweet format for compatibility with existing components
export const MOCK_CLASSIFIED_TWEETS: ClassifiedTweet[] = MOCK_TWEETS.map((tweet) => ({
  id: tweet.id,
  timestamp: tweet.createdAt,
  handle: tweet.handle || "@unknown",
  text: tweet.text,
  disaster: tweet.type,
  stateId: `US-${tweet.state}`,
  city: tweet.city,
  confidence: tweet.confidence,
}));

// Mock notification history
export const MOCK_NOTIFICATION_HISTORY = [
  {
    id: "notif-1",
    sentAt: "2025-10-27T14:30:00.000Z",
    channel: "Email",
    summary: "New wildfire alert in CA",
    status: "Delivered",
  },
  {
    id: "notif-2",
    sentAt: "2025-10-27T13:15:00.000Z",
    channel: "Webhook",
    summary: "Hurricane warning in FL",
    status: "Delivered",
  },
  {
    id: "notif-3",
    sentAt: "2025-10-27T12:00:00.000Z",
    channel: "Email",
    summary: "Earthquake detected in CA",
    status: "Delivered",
  },
  {
    id: "notif-4",
    sentAt: "2025-10-27T10:30:00.000Z",
    channel: "Webhook",
    summary: "Flood warning in TX",
    status: "Failed",
  },
  {
    id: "notif-5",
    sentAt: "2025-10-27T09:00:00.000Z",
    channel: "Email",
    summary: "Daily incident summary",
    status: "Delivered",
  },
];

// ============================================================================
// MOCK TWEET STREAM (for live updates)
// ============================================================================

// Simple UUID generator that works in all environments
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

type Listener = (tweet: ClassifiedTweet) => void;
const listeners = new Set<Listener>();

export function subscribeToTweetStream(cb: Listener) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

const users = ["@quakereport", "@stormwatch", "@wildfire_eye", "@floodalert", "@newswire"];
const cities = [
  { city: "Los Angeles, CA", stateId: "US-CA", state: "CA" },
  { city: "Miami, FL", stateId: "US-FL", state: "FL" },
  { city: "Houston, TX", stateId: "US-TX", state: "TX" },
  { city: "New York, NY", stateId: "US-NY", state: "NY" },
  { city: "Seattle, WA", stateId: "US-WA", state: "WA" },
];
const disasters: Disaster[] = ["earthquake", "wildfire", "flood", "hurricane", "other"];

let ticking = false;
export function startMockTweetPump() {
  if (ticking) return;
  ticking = true;
  setInterval(() => {
    const d = disasters[Math.floor(Math.random() * disasters.length)];
    const place = cities[Math.floor(Math.random() * cities.length)];
    const tweet: ClassifiedTweet = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      handle: users[Math.floor(Math.random() * users.length)],
      text:
        d === "wildfire"
          ? "Smoke visible on ridge; crews en route."
          : d === "flood"
          ? "Roadway flooded; vehicles stranded."
          : d === "hurricane"
          ? "Wind gusts increasing along the coast."
          : d === "earthquake"
          ? "Short jolt reported; checking damage."
          : "Power outage reported across neighborhood.",
      disaster: d,
      stateId: place.stateId,
      city: place.city,
      confidence: 0.75 + Math.random() * 0.2,
    };
    listeners.forEach((fn) => fn(tweet));
  }, 2000);
}
