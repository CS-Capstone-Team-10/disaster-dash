import type { MockTweet } from "@/lib/mock";

export type WindowKey = "1h" | "24h" | "7d";
export type Disaster = MockTweet["type"];

export function filterTweets(
  tweets: MockTweet[],
  opts: { window: WindowKey; type: Disaster | "all"; minConf: number }
): MockTweet[] {
  const now = Date.now();
  const ms = opts.window === "1h" ? 3600e3 : opts.window === "24h" ? 86400e3 : 7 * 86400e3;
  return tweets.filter(t =>
    (opts.type === "all" || t.type === opts.type) &&
    t.confidence >= opts.minConf &&
    now - new Date(t.createdAt).getTime() <= ms
  );
}

export function splitCurrentVsPrev(
  tweets: MockTweet[],
  windowKey: WindowKey
): { current: MockTweet[]; previous: MockTweet[] } {
  const now = Date.now();
  const ms = windowKey === "1h" ? 3600e3 : windowKey === "24h" ? 86400e3 : 7 * 86400e3;
  const curStart = now - ms;
  const prevStart = now - 2 * ms;
  return {
    current: tweets.filter(t => +new Date(t.createdAt) > curStart),
    previous: tweets.filter(t => +new Date(t.createdAt) > prevStart && +new Date(t.createdAt) <= curStart),
  };
}

export function percentChange(cur: number, prev: number): number {
  return prev === 0 ? (cur > 0 ? 100 : 0) : ((cur - prev) / prev) * 100;
}

// Bucketing helper: floor to hour for 1h/24h, to day for 7d
export function bucketTimestamp(ts: string, windowKey: WindowKey): string {
  const d = new Date(ts);
  if (windowKey === "7d") {
    d.setHours(0, 0, 0, 0);
  } else {
    d.setMinutes(0, 0, 0);
  }
  return d.toISOString();
}

export function seriesIncidentsOverTimeByType(
  tweets: MockTweet[],
  windowKey: WindowKey
) {
  // Return Nivo Stream format: [{ x: ISO, earthquake: n, wildfire: n, ... }, ...]
  const byBucket: Record<string, Record<Disaster, number>> = {};
  for (const t of tweets) {
    const x = bucketTimestamp(t.createdAt, windowKey);
    byBucket[x] ??= { earthquake: 0, wildfire: 0, flood: 0, hurricane: 0, other: 0 };
    byBucket[x][t.type] += 1;
  }
  return Object.entries(byBucket)
    .sort(([a], [b]) => +new Date(a) - +new Date(b))
    .map(([x, vals]) => ({ x, ...vals }));
}

export function topCities(tweets: MockTweet[], max = 10) {
  const map = new Map<string, number>();
  for (const t of tweets) {
    if (!t.city || !t.state) continue;
    const key = `${t.city}, ${t.state}`;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([cityState, count]) => ({ cityState, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, max);
}

export function confidenceHistogram(tweets: MockTweet[], bins = 20) {
  const arr = new Array(bins).fill(0);
  for (const t of tweets) {
    let idx = Math.floor(t.confidence * bins);
    if (idx === bins) idx = bins - 1;
    arr[idx] += 1;
  }
  return arr.map((n, i) => ({
    bin: i, // 0..bins-1
    label: `${(i / bins).toFixed(2)}–${((i + 1) / bins).toFixed(2)}`,
    n,
  }));
}

export function statusByType(tweets: MockTweet[]) {
  // For stacked bars: [{ type:"earthquake", new:n, triaged:n, dismissed:n }, ...]
  const types: Disaster[] = ["earthquake", "wildfire", "flood", "hurricane", "other"];
  const by: Record<Disaster, { new: number; triaged: number; dismissed: number }> = Object.fromEntries(
    types.map(t => [t, { new: 0, triaged: 0, dismissed: 0 }])
  ) as Record<Disaster, { new: number; triaged: number; dismissed: number }>;

  for (const t of tweets) {
    by[t.type][t.status] += 1;
  }
  return types.map(type => ({ type, ...by[type] }));
}

// Generate sparkline data for KPI cards
export function sparklineData(tweets: MockTweet[], windowKey: WindowKey, points = 12) {
  const byBucket: Record<string, number> = {};
  for (const t of tweets) {
    const x = bucketTimestamp(t.createdAt, windowKey);
    byBucket[x] = (byBucket[x] ?? 0) + 1;
  }

  const sorted = Object.entries(byBucket)
    .sort(([a], [b]) => +new Date(a) - +new Date(b))
    .slice(-points);

  return sorted.map(([x, y]) => ({ x, y }));
}
