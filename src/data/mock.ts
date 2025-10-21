import type { ClassifiedTweet, MetricsSnapshot, Disaster } from "@/types/incidents";

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

// --- simple mock stream that everyone can subscribe to ---
type Listener = (tweet: ClassifiedTweet) => void;
const listeners = new Set<Listener>();

export function subscribeToTweetStream(cb: Listener) {
  listeners.add(cb);
  return () => listeners.delete(cb);
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
